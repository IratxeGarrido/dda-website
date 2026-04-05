class DuckHeader extends HTMLElement {
  connectedCallback() {
    const currentPage = document.body.dataset.page || "";

    const navLinkClass = (page, mobile = false) => {
      const base = mobile
        ? "block w-full text-base font-semibold px-5 py-4 rounded-2xl transition"
        : "block text-sm font-semibold px-4 py-3 rounded-full transition";

      const active = mobile
        ? "bg-[#2f2f2f] text-white"
        : "bg-[#2f2f2f] text-white";

      const inactive = mobile
        ? "bg-white/80 hover:bg-white text-[#2f2f2f]"
        : "hover:bg-black/5 text-[#2f2f2f]";

      return `${base} ${currentPage === page ? active : inactive}`;
    };

    this.innerHTML = `
      <header
        id="site-header"
        class="sticky top-0 z-50 bg-[#f4efe8]/90 backdrop-blur border-b border-black/5 transition-all duration-300"
      >
        <div
          id="header-inner"
          class="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between gap-4 transition-all duration-300"
        >
          <a href="/index.html" class="flex items-center min-w-0 shrink-0">
            <img
              id="header-logo"
              src="/images/DDA-logo.png"
              alt="Duck Dating Apps logo"
              class="h-12 md:h-14 w-auto object-contain transition-all duration-300"
            >
          </a>

          <!-- Desktop nav -->
          <nav class="hidden md:flex items-center gap-2">
            <a href="/index.html" class="${navLinkClass("home")}">WTF is this?</a>
            <a href="/events.html" class="${navLinkClass("events")}">Events Calendar</a>
            <a href="/jewel.html" class="${navLinkClass("jewel")}">Our Jewel</a>
            <a href="/faq.html" class="${navLinkClass("faq")}">DAQ's</a>
            <a href="/contact.html" class="${navLinkClass("contact")}">Stay in the loop</a>
          </nav>

          <!-- Mobile menu button -->
          <button
            id="menu-btn"
            class="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-black/10 bg-white/80 hover:bg-white transition shrink-0"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Mobile nav -->
        <div
          id="mobile-menu"
          class="md:hidden hidden border-t border-black/5 px-4 pb-5 pt-4"
        >
          <div class="flex items-center justify-between mb-4">
            <img
              src="/images/DDA-logo.png"
              alt="Duck Dating Apps logo"
              class="h-12 w-auto object-contain"
            >

            <button
              id="menu-close-btn"
              class="inline-flex items-center justify-center w-11 h-11 rounded-full border border-black/10 bg-white/80 hover:bg-white transition"
              aria-label="Close menu"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6l-12 12" />
              </svg>
            </button>
          </div>

          <nav class="flex flex-col gap-3">
            <a href="/index.html" class="${navLinkClass("home", true)}">WTF is this?</a>
            <a href="/events.html" class="${navLinkClass("events", true)}">Events Calendar</a>
            <a href="/jewel.html" class="${navLinkClass("jewel", true)}">Our Jewel</a>
            <a href="/faq.html" class="${navLinkClass("faq", true)}">DAQ's</a>
            <a href="/contact.html" class="${navLinkClass("contact", true)}">Stay in the loop</a>
          </nav>
        </div>
      </header>
    `;

    const header = this.querySelector("#site-header");
    const headerInner = this.querySelector("#header-inner");
    const headerLogo = this.querySelector("#header-logo");
    const menuBtn = this.querySelector("#menu-btn");
    const closeBtn = this.querySelector("#menu-close-btn");
    const mobileMenu = this.querySelector("#mobile-menu");

    const setCompactHeader = () => {
      const isScrolled = window.scrollY > 24;

      if (isScrolled) {
        headerInner.classList.remove("py-3", "md:py-4");
        headerInner.classList.add("py-2", "md:py-2");

        headerLogo.classList.remove("h-12", "md:h-14");
        headerLogo.classList.add("h-10", "md:h-11");

        header.classList.add("shadow-sm");
      } else {
        headerInner.classList.remove("py-2", "md:py-2");
        headerInner.classList.add("py-3", "md:py-4");

        headerLogo.classList.remove("h-10", "md:h-11");
        headerLogo.classList.add("h-12", "md:h-14");

        header.classList.remove("shadow-sm");
      }
    };

    const openMenu = () => {
      mobileMenu.classList.remove("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("overflow-hidden");
    };

    const closeMenu = () => {
      mobileMenu.classList.add("hidden");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    };

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", openMenu);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu);
    }

    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("scroll", setCompactHeader, { passive: true });
    setCompactHeader();
  }
}

customElements.define("duck-header", DuckHeader);