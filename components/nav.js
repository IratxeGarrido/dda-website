class DuckNav extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                nav {
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
                .nav-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo {
                    font-weight: 800;
                    font-size: 1.5rem;
                    color: #2F2F2F;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    text-decoration: none;
                }
                .logo img {
                    height: 42px;
                    width: auto;
                    display: block;
                }
                .nav-links {
                    display: flex;
                    gap: 2rem;
                }
                .nav-link {
                    color: #2F2F2F;
                    font-weight: 500;
                    transition: color 0.2s;
                    text-decoration: none;
                }
                .nav-link:hover {
                    color: #FF9A3C;
                }
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                    .mobile-menu-btn {
                        display: block;
                    }
                }
            </style>
            <nav>
                <div class="nav-container">
                    <a href="/" class="logo">
                        <img src="/images/DDA-logo.jpg" alt="Duck Dating Apps Logo">
                        <span>Duck Dating Apps</span>
                    </a>

                    <div class="nav-links">
                        <a href="/index.html" class="nav-link">About</a>
                        <a href="/events.html" class="nav-link">Events</a>
                        <a href="/how-it-works" class="nav-link">How It Works</a>
                        <a href="/contact.html" class="nav-link">Contact</a>
                    </div>

                    <button class="mobile-menu-btn">
                        <i data-feather="menu"></i>
                    </button>
                </div>
            </nav>
        `;
    }
}

customElements.define('duck-nav', DuckNav);
