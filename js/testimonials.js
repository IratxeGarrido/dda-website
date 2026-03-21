async function loadTestimonials() {
  const track = document.getElementById("testimonial-track");
  if (!track) return;

  try {
    const response = await fetch("/data/testimonials.json");
    const testimonials = await response.json();

    const renderCard = (item) => `
      <div class="w-[300px] shrink-0 bg-white rounded-[2rem] border border-black/10 shadow-md p-6">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-full border border-black/10"
            style="background:${item.avatarColor};"
          ></div>
          <div>
            <p class="font-black text-lg">${item.name}</p>
            <p class="text-sm text-black/50">${item.event} · ${item.date}</p>
          </div>
        </div>
        <p class="mt-5 text-black/70">${item.review}</p>
      </div>
    `;

    track.innerHTML =
      testimonials.map(renderCard).join("") +
      testimonials.map(renderCard).join("");
  } catch (error) {
    console.error("Could not load testimonials:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadTestimonials);