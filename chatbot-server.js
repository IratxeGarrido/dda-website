import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

const PLANNING_DATA_FILE = path.join(__dirname, "data", "planning.json");

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
  fs.mkdirSync(path.join(__dirname, "data"));
}

// Helper functions for planning data
function loadPlanning() {
  if (fs.existsSync(PLANNING_DATA_FILE)) {
    return JSON.parse(fs.readFileSync(PLANNING_DATA_FILE, "utf8"));
  }
  return {};
}

function savePlanning(planning) {
  fs.writeFileSync(PLANNING_DATA_FILE, JSON.stringify(planning, null, 2));
}

function generatePollId() {
  return crypto.randomBytes(8).toString("hex");
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a friendly and helpful chatbot for Duck Dating Apps, a Berlin-based platform for inclusive in-person dating events.

**Our Events:**
1. **Blind Duck Dating Berlin** - Ongoing
   - Curated blind dating events with 8-person groups
   - Focus on meaningful conversations and balanced matching
   - Free to apply, €5 to attend
   - Current deadline: June 15, 2026
   - How it works: 1) Apply (free) → 2) Meet IRL (€5) → 3) Choose via our matching software

2. **Poly Speed Dating Berlin** - Postponed (coming soon)
   - Moderated poly speed dating in Treptower Park
   - For polyamorous, non-monogamous, LGBTQ+, and open-minded people
   - Every few months

**FAQ Answers:**

Q: What is Duck Dating Apps?
A: Duck Dating Apps creates small, curated in-person dating events in Berlin. We focus on meaningful connections beyond swiping, with real conversations and thoughtful matching.

Q: How does the matching work?
A: We use a combination of hand-picked curation and our proprietary "Jewel" algorithm. The Jewel solves two problems: removing the awkwardness of asking for contact details and protecting people from unwanted connections. Only people who mutually want to connect are matched.

Q: Who can apply?
A: Anyone 18+ looking for romance, friendship, or community. We welcome LGBTQ+ people, polyamorous individuals, and people of all relationship styles.

Q: Is it really free to apply?
A: Yes! Applying to Blind Duck Dating is completely free. The €5 fee only applies if you're selected and attend an event.

Q: How many people attend?
A: Events have groups of 8 people, each attending for about 2 hours.

Q: What makes Duck Dating different from apps?
A: No endless swiping, real conversations with vetted matches, thoughtful curation based on interests and vibe, and privacy protection through our matching software.

Q: When is the next event?
A: Check our calendar on the website or ask me about our current events! Blind Duck Dating has a deadline of June 15, 2026.

**Your Role:**
- Answer FAQs about our events, application process, and values
- Be warm, enthusiastic, and welcoming
- When someone asks about applying or events, encourage them to:
  1. **Apply for Free** at https://app.duckdatingapps.com/users/sign_up
  2. Or join our mailing list for updates
- Keep responses concise (2-3 sentences max)
- Use emojis sparingly to match our brand (🦆 duck, 💗 heart, 🎉 events)
- If someone asks something you don't know, be honest and suggest they check the website or reach out

**Brand voice:** Friendly, inclusive, non-judgmental, fun but genuine.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat message",
      details: error.message,
    });
  }
});

// Planning API Endpoints
app.post("/api/planning/create", (req, res) => {
  try {
    const { title, description, dates, participantCount } = req.body;

    if (!title || !dates || dates.length !== 3) {
      return res.status(400).json({ error: "Invalid poll data" });
    }

    const pollId = generatePollId();
    const planning = loadPlanning();

    planning[pollId] = {
      id: pollId,
      title,
      description: description || "",
      dates,
      expectedParticipants: participantCount || 8,
      votes: {},
      createdAt: new Date().toISOString(),
    };

    savePlanning(planning);

    res.json({ pollId, success: true });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
});

app.get("/api/planning/list", (req, res) => {
  try {
    const planning = loadPlanning();
    const pollsList = Object.values(planning).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(pollsList);
  } catch (error) {
    console.error("Error listing polls:", error);
    res.status(500).json({ error: "Failed to list polls" });
  }
});

app.get("/api/planning/:pollId", (req, res) => {
  try {
    const { pollId } = req.params;
    const planning = loadPlanning();

    if (!planning[pollId]) {
      return res.status(404).json({ error: "Poll not found" });
    }

    res.json(planning[pollId]);
  } catch (error) {
    console.error("Error loading poll:", error);
    res.status(500).json({ error: "Failed to load poll" });
  }
});

app.post("/api/planning/:pollId/vote", (req, res) => {
  try {
    const { pollId } = req.params;
    const { userName, votes } = req.body;

    if (!userName || !votes) {
      return res.status(400).json({ error: "Missing vote data" });
    }

    const planning = loadPlanning();

    if (!planning[pollId]) {
      return res.status(404).json({ error: "Poll not found" });
    }

    planning[pollId].votes[userName] = votes;
    savePlanning(planning);

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving vote:", error);
    res.status(500).json({ error: "Failed to save vote" });
  }
});

app.delete("/api/planning/:pollId", (req, res) => {
  try {
    const { pollId } = req.params;
    const planning = loadPlanning();

    if (!planning[pollId]) {
      return res.status(404).json({ error: "Poll not found" });
    }

    delete planning[pollId];
    savePlanning(planning);

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting poll:", error);
    res.status(500).json({ error: "Failed to delete poll" });
  }
});

app.post("/api/planning/:pollId/participant/:action", (req, res) => {
  try {
    const { pollId, action } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const planning = loadPlanning();

    if (!planning[pollId]) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const poll = planning[pollId];

    if (action === "add") {
      if (!poll.participants.includes(name)) {
        poll.participants.push(name);
        poll.votes[name] = {
          dates: {},
          unavailable: false,
          alternativeDate: null,
        };
        poll.dates.forEach((_, index) => {
          poll.votes[name].dates[index] = false;
        });
      }
    } else if (action === "remove") {
      poll.participants = poll.participants.filter((p) => p !== name);
      delete poll.votes[name];
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    savePlanning(planning);
    res.json({ success: true });
  } catch (error) {
    console.error("Error managing participant:", error);
    res.status(500).json({ error: "Failed to manage participant" });
  }
});

// Serve static files
app.use(express.static("."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chatbot server running on http://localhost:${PORT}`);
  console.log("Make sure ANTHROPIC_API_KEY is set in your .env file");
});
