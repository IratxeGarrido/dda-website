class DuckFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="py-10 border-t border-black/10 bg-[#f4efe8]">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="font-black text-2xl">DUCK DATING APPS</div>
            <div class="text-black/60 mt-1">In-person dating events for people tired of dating apps.</div>
          </div>

<div class="flex gap-6 text-sm text-black/60">
  <a href="/imprint.html">Imprint</a>
  <a href="/privacy.html">Datenschutz</a>
</div>
        </div>
      </footer>
    `;
  }
}

customElements.define('duck-footer', DuckFooter);