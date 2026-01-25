class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: #1f2937;
                    color: white;
                    padding: 4rem 2rem;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 3rem;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: bold;
                    font-size: 1.25rem;
                    margin-bottom: 1.5rem;
                }
                .logo-img {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                }
                .footer-text {
                    color: #9ca3af;
                    margin-bottom: 1.5rem;
                    line-height: 1.6;
                }
                .social-links {
                    display: flex;
                    gap: 1rem;
                }
                .social-link {
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #374151;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s;
                }
                .social-link:hover {
                    background-color: #f97316;
                }
                .footer-heading {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: white;
                }
                .footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .footer-link {
                    color: #9ca3af;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-link:hover {
                    color: #f97316;
                }
                .copyright {
                    margin-top: 4rem;
                    text-align: center;
                    color: #6b7280;
                    font-size: 0.875rem;
                }
            </style>
            <div class="container">
                <div>
                    <div class="logo">
                        <img src="http://static.photos/white/200x200/42" alt="Duck logo" class="logo-img">
                        Duck Dating
                    </div>
                    <p class="footer-text">
                        Real-Time Speed Dating for Monogamous People. Creating meaningful connections with warmth, curiosity, and respect.
                    </p>
                    <div class="social-links">
                        <a href="#" class="social-link">
                            <i data-feather="instagram"></i>
                        </a>
                        <a href="#" class="social-link">
                            <i data-feather="twitter"></i>
                        </a>
                        <a href="#" class="social-link">
                            <i data-feather="facebook"></i>
                        </a>
                        <a href="#" class="social-link">
                            <i data-feather="youtube"></i>
                        </a>
                    </div>
                </div>
                <div>
                    <h3 class="footer-heading">Events</h3>
                    <div class="footer-links">
                        <a href="#" class="footer-link">Speed Dating</a>
                        <a href="#" class="footer-link">Virtual Mixers</a>
                        <a href="#" class="footer-link">Themed Nights</a>
                        <a href="#" class="footer-link">Workshops</a>
                    </div>
                </div>
                <div>
                    <h3 class="footer-heading">Company</h3>
                    <div class="footer-links">
                        <a href="about.html" class="footer-link">About Us</a>
                        <a href="blog.html" class="footer-link">Blog</a>
                        <a href="careers.html" class="footer-link">Careers</a>
                        <a href="press.html" class="footer-link">Press</a>
                    </div>
                </div>
                <div>
                    <h3 class="footer-heading">Support</h3>
                    <div class="footer-links">
                        <a href="faq.html" class="footer-link">FAQ</a>
                        <a href="contact.html" class="footer-link">Contact Us</a>
                        <a href="#" class="footer-link">Privacy Policy</a>
                        <a href="#" class="footer-link">Terms of Service</a>
                    </div>
                </div>
            </div>
            <div class="copyright">
                &copy; ${new Date().getFullYear()} Duck Dating Apps. All rights reserved.
            </div>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);