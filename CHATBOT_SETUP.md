# Duck Dating Apps Chatbot Setup

This chatbot answers FAQs about Duck Dating Apps events and guides users to apply or join the mailing list. It uses Claude AI to provide intelligent, friendly responses.

## Features

✅ Answers FAQs about events (Blind Duck Dating, Poly Speed Dating)
✅ Guides users to apply for free
✅ Prompts users to join the mailing list
✅ Free with Claude's generous free tier
✅ Friendly, inclusive tone matching your brand

## Cost

**Free!** Claude API has a generous free tier:
- 3.2M input tokens per month
- 10K output tokens per day (sufficient for most chat use)

For higher volumes, pricing is very affordable (~$0.003 per 1K input tokens).

## Setup Instructions

### 1. Get a Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Create a new API key
4. Copy it

### 2. Install Dependencies

```bash
cd /path/to/dda-website
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Then edit `.env` and paste your API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 4. Run the Server

```bash
npm start
```

You should see:
```
Chatbot server running on http://localhost:3000
```

### 5. Integrate into Your Website

Add this line to your `index.html` before the closing `</body>` tag:

```html
<script src="/chatbot.html" defer></script>
```

Actually, since chatbot.html is HTML not JS, you need to embed it directly. Replace the script line with:

Add the chatbot HTML directly before your closing `</body>` tag in `index.html`:

```html
<!-- Duck Dating Chatbot Widget -->
<script>
  fetch('/chatbot.html')
    .then(r => r.text())
    .then(html => {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.appendChild(temp.firstElementChild);
      // Re-run the script in the chatbot.html
      temp.querySelectorAll('script').forEach(script => {
        eval(script.textContent);
      });
    });
</script>
```

**Better approach:** Import chatbot.html as a component:

In `index.html`, add this before `</body>`:

```html
<!-- Chat Widget Loader -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/chatbot.html')
      .then(response => response.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
      })
      .catch(err => console.log('Chatbot load error:', err));
  });
</script>
```

### 6. Test the Chatbot

1. Open `http://localhost:3000` in your browser
2. Look for the 🦆 button in the bottom-right corner
3. Click to open the chatbot
4. Ask: "Tell me about Blind Duck Dating" or "How do I apply?"

## Customization

### Edit FAQ Content

Open `chatbot-server.js` and modify the `SYSTEM_PROMPT` to:
- Add new events or FAQs
- Change the tone
- Add links to your mailing list signup
- Update event details (dates, prices, etc.)

### Style the Chatbot

Edit colors in `chatbot.html`:
- Change `#ff5b92` (pink) to your brand color
- Adjust widget width (default: 384px / 96 on tailwind)
- Modify text sizes and spacing

### Add to Multiple Pages

Copy the script loader to any page where you want the chatbot.

## Deployment

### Option 1: Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable `ANTHROPIC_API_KEY` in Vercel dashboard
5. Deploy

### Option 2: Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → GitHub repo
4. Add env var `ANTHROPIC_API_KEY`
5. Deploy

### Option 3: Your Own Server

```bash
npm install -g pm2
pm2 start chatbot-server.js --name "dda-chatbot"
pm2 save
pm2 startup
```

## Troubleshooting

**"API key not found"**
- Make sure `.env` file exists with your key
- Check the key is valid at console.anthropic.com

**Chatbot not showing on page**
- Check browser console for errors (F12)
- Make sure chatbot-server.js is running
- Verify the fetch URL matches your server

**Getting slow responses**
- Check your Claude API quota at console.anthropic.com
- Rate limiting is in place to prevent abuse

## Example Questions Users Might Ask

- "What is Duck Dating Apps?"
- "How much does it cost?"
- "How do I apply?"
- "What's happening on June 15th?"
- "Is this for LGBTQ+ people?"
- "Tell me about Poly Speed Dating"
- "How does the matching algorithm work?"
- "When's the next event?"

## Support

If the chatbot isn't working:
1. Check that `ANTHROPIC_API_KEY` is set: `echo $ANTHROPIC_API_KEY`
2. Check server logs for errors
3. Test the API manually:
   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hi!"}'
   ```

---

**Next Steps:**
1. Install dependencies: `npm install`
2. Set up `.env` with your API key
3. Run `npm start`
4. Test locally, then deploy!
