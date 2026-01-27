class DuckFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: #2F2F2F;
                    color: white;
                    padding: 3rem 2rem;
                }
                .footer-container {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }
                .footer-logo {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .footer-link {
                    color: #F8F9FA;
                    transition: color 0.2s;
                }
                .footer-link:hover {
                    color: #FFD166;
                }
                .social-links {
                    display: flex;
                    gap: 1rem;
                }
                .social-link {
                    color: white;
                    transition: color 0.2s;
                }
                .social-link:hover {
                    color: #FFD166;
                }
                .copyright {
                    grid-column: 1 / -1;
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.7);
                }
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            <footer>
                <div class="footer-container">
                    <div>
                        <div class="footer-logo">
                            <span>🦆 Duck Dating Quackery</span>
                        </div>
                        <p class="text-gray-300">Real-Time Speed Dating Events for meaningful connections.</p>
                    </div>
                    <div>
                        <h3 class="font-bold mb-4">Quick Links</h3>
                        <div class="footer-links">
                            <a href="/about" class="footer-link">About</a>
                            <a href="/events" class="footer-link">Events</a>
                            <a href="/how-it-works" class="footer-link">How It Works</a>
                            <a href="/code-of-conduct" class="footer-link">Code of Conduct</a>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold mb-4">Contact</h3>
                        <div class="footer-links">
                            <a href="mailto:hello@duckdating.com" class="footer-link">Email Us</a>
                            <a href="/faq" class="footer-link">FAQ</a>
                            <a href="/press" class="footer-link">Press</a>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold mb-4">Follow Us</h3>
                        <div class="social-links">
                            <a href="https://instagram.com/duckdating" class="social-link">
                                <i data-feather="instagram"></i>
                            </a>
                            <a href="https://twitter.com/duckdating" class="social-link">
                                <i data-feather="twitter"></i>
                            </a>
                            <a href="https://facebook.com/duckdating" class="social-link">
                                <i data-feather="facebook"></i>
                            </a>
                        </div>
                    </div>
                    <div class="copyright">
                        © 2023 Duck Dating Quackery — Real-Time Speed Dating Events
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('duck-footer', DuckFooter);