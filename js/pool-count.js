async function loadPoolCount() {
  const el = document.getElementById("pool-count");
  if (!el) return;

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyqoDF4PxPC6EX4YYp5I6rRZWyQgDnx7ckFdSx6od9olybD0gQzwbAYIH8IE85GvLT1lw/exec");
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.count === "number") {
      el.textContent = data.count;
    } else {
      el.textContent = "soon";
      console.error("Invalid pool count response:", data);
    }
  } catch (error) {
    console.error("Could not load pool count:", error);
    el.textContent = "soon";
  }
}

document.addEventListener("DOMContentLoaded", loadPoolCount);