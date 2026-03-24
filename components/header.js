class DuckHeader extends HTMLElement {
  connectedCallback() {
    const currentPage = document.body.dataset.page || "";

    const navLinkClass = (page) => {
      const isActive = currentPage === page;

      return isActive
        ? "text-sm font-semibold px-4 py-2 rounded-full bg-[#2f2f2f] text-white"
        : "text-sm font-semibold px-4 py-2 rounded-full hover:bg-black/5 transition";
    };

    this.innerHTML = `
      <header class="sticky top-0 z-50 bg-[#f4efe8]/90 backdrop-blur border-b border-black/5">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/index.html" class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-black/10 bg-pink-200">
              <img src="/images/DDA-logo.jpg" alt="Blind Duck Dating logo" class="w-full h-full object-cover">
            </div>
            <div>
              <div class="text-2xl md:text-3xl font-black tracking-tight leading-none">DUCK DATING</div>
              <div class="text-2xl md:text-3xl font-black tracking-tight leading-none">APPS</div>
            </div>
          </a>

          <nav class="hidden md:flex items-center gap-2">
            <a href="/index.html" class="${navLinkClass("home")}">WTF is this?</a>
            <a href="/events.html" class="${navLinkClass("events")}">Events Calendar</a>
           <a href="/jewel.html" class="${navLinkClass('jewel')}">Our Jewel</a>
            <a href="/faq.html" class="${navLinkClass("faq")}">DAQ's</a>
            <a href="/contact.html" class="${navLinkClass("contact")}">Stay in the loop</a>
          </nav>
        </div>
      </header>
    `;
  }
}

customElements.define("duck-header", DuckHeader);