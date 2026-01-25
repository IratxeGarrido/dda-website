class CustomNavbar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    position: sticky;
                    top: 0;
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 50;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: bold;
                    font-size: 1.25rem;
                    color: #1f2937;
                    text-decoration: none;
                }
                .logo-img {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                }
                .nav-items {
                    display: flex;
                    gap: 1.5rem;
                }
                .nav-item {
                    color: #4b5563;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                }
                .nav-item:hover {
                    color: #f97316;
                }
                .nav-item.active {
                    color: #f97316;
                }
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block;
                    }
                    .nav-items {
                        display: none;
                        flex-direction: column;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background-color: white;
                        padding: 1rem 2rem;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .nav-items.open {
                        display: flex;
                    }
                }
            </style>

            
            
            <div class="container">
           <a href="index.html" class="logo">
  <img src="images/DDA-logo.jpg" alt="Duck Dating Apps logo" class="logo-img">
  Duck Dating Apps
</a>

                <button class="mobile-menu-btn" id="menu-btn">
                    <i data-feather="menu"></i>
                </button>
                <div class="nav-items" id="nav-items">
                    <a href="index.html" class="nav-item active">Home</a>
                    <a href="calendar.html" class="nav-item">Calendar</a>
                    <a href="faq.html" class="nav-item">FAQ</a>
                    <a href="contact.html" class="nav-item">Contact</a>
                </div>
            </div>
        `;

        const menuBtn = this.shadowRoot.getElementById('menu-btn');
        const navItems = this.shadowRoot.getElementById('nav-items');

        menuBtn.addEventListener('click', () => {
            navItems.classList.toggle('open');
        });

        // Update active nav item based on current page
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = this.shadowRoot.querySelectorAll('.nav-item');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (path === linkPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

customElements.define('custom-navbar', CustomNavbar);