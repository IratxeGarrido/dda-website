class DuckFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: #2F2F2F;
                    color: rgba(255,255,255,0.85);
                    padding: 1.25rem 2rem;
                    font-size: 0.95rem;
                }

                .footer-bar {
                    max-width: 1280px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                    text-align: center;
                }

                .footer-link {
                    color: rgba(255,255,255,0.85);
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .footer-link:hover {
                    color: #FFD166;
                }

                .brand {
                    font-weight: 600;
                    color: white;
                }

                .divider {
                    opacity: 0.3;
                }
            </style>

            <footer>
                <div class="footer-bar">
                    <span class="brand">🦆 Duck Dating Apps © 2026</span>
                    <span class="divider">|</span>
                    <span>I need to write something for now</span>
                    <span class="divider">|</span>
                                      <span>Imprint</span>
                </div>
            </footer>
        `;
    }
}

customElements.define('duck-footer', DuckFooter);
