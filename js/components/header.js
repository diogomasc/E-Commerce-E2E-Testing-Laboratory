import { authService } from '../services/auth.service.js';
import { cartService } from '../services/cart.service.js';

class HeaderComponent {
    constructor() {
        this.container = document.getElementById('main-header');
        if (this.container) {
            this.render();
            this.bindEvents();
            this.listenToCartEvents();
        }
    }

    render() {
        const user = authService.getCurrentUser();
        const cart = cartService.getCart();
        const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        const authDesktop = user 
            ? `
                <div class="desktop-only" style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <a href="profile.html" data-testid="user-greeting" style="font-weight: bold; color: var(--color-text);">Olá, ${user.firstName}</a>
                    <button class="btn btn--outline logout-btn" style="padding: 4px 8px; font-size: var(--font-size-sm);" data-testid="logout-btn-desktop">Sair</button>
                </div>
              `
            : `
                <a href="login.html" class="btn btn--outline desktop-only" data-testid="nav-login-link">Login / Registrar</a>
              `;

        const authMobileIcon = user
            ? `<a href="profile.html" aria-label="Perfil" data-testid="mobile-profile-link" style="font-size: 1.5rem; color: var(--color-primary); text-decoration: none;">👤</a>`
            : `<a href="login.html" aria-label="Login" data-testid="mobile-login-link" style="font-size: 1.5rem; color: var(--color-primary); text-decoration: none;">👤</a>`;

        const authMobileMenu = user
            ? `<button class="mobile-menu-link logout-btn" data-testid="logout-btn-mobile" style="text-align: left; background: none; border: none; padding: 0; color: var(--color-error); font-size: 1.125rem; font-weight: 500; cursor: pointer; display: block; width: 100%;">Sair</button>`
            : `<a href="login.html" class="mobile-menu-link" data-testid="mobile-menu-login-link" style="font-size: 1.125rem; font-weight: 500; text-decoration: none; color: var(--color-text); display: block;">Login / Registrar</a>`;

        this.container.innerHTML = `
            <div class="header__container">
                <div class="header__top-row">
                    <button class="header__toggle" id="header-toggle" aria-label="Abrir menu">
                        <span class="icon-burger">☰</span>
                        <span class="icon-close" style="display: none;">✕</span>
                    </button>

                    <a href="index.html" class="logo" data-testid="nav-logo" style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-primary); margin-right: auto; margin-left: var(--spacing-sm);">
                        E2E Store
                    </a>

                    <div class="header__search desktop-search">
                        <form id="global-search-form-desktop" class="search-form" data-testid="global-search-form" style="display: flex; width: 100%;">
                            <input type="text" id="global-search-input-desktop" class="form-control" placeholder="Buscar produtos..." data-testid="global-search-input" style="border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);">
                            <button type="submit" class="btn btn--primary" data-testid="global-search-btn" style="border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;">🔍</button>
                        </form>
                    </div>

                    <div class="header__actions">
                        <nav class="header__desktop-nav desktop-only">
                            <a href="catalog.html" data-testid="nav-catalog-link" style="font-weight: 500;">Catálogo</a>
                            <a href="about.html" data-testid="nav-about-link" style="font-weight: 500;">Sobre</a>
                        </nav>
                        
                        ${authDesktop}
                        
                        <div class="mobile-only" style="display: none;">
                            ${authMobileIcon}
                        </div>
                        
                        <a href="cart.html" data-testid="nav-cart-link" style="position: relative; display: flex; align-items: center; text-decoration: none; margin-left: var(--spacing-sm); margin-right: var(--spacing-sm);">
                            <span style="font-size: 1.5rem;">🛒</span>
                            <span id="cart-counter" data-testid="cart-counter" class="badge" style="position: absolute; top: -8px; right: -12px;">${cartCount}</span>
                        </a>
                    </div>
                </div>

                <!-- Mobile search row -->
                <div class="header__search mobile-search" style="display: none; width: 100%; margin-top: var(--spacing-md);">
                    <form id="global-search-form-mobile" class="search-form" style="display: flex; width: 100%;">
                        <input type="text" id="global-search-input-mobile" class="form-control" placeholder="Buscar produtos..." style="border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);">
                        <button type="submit" class="btn btn--primary" style="border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;">🔍</button>
                    </form>
                </div>

                <!-- Mobile sliding menu -->
                <div class="header__mobile-menu" id="header-menu">
                    <nav class="mobile-nav-links" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                        <a href="catalog.html" data-testid="nav-catalog-link-mobile" style="font-size: 1.125rem; font-weight: 500; text-decoration: none; color: var(--color-text);">Catálogo</a>
                        <a href="about.html" data-testid="nav-about-link-mobile" style="font-size: 1.125rem; font-weight: 500; text-decoration: none; color: var(--color-text);">Sobre</a>
                        <hr style="border: none; border-top: 1px solid var(--color-border); margin: var(--spacing-xs) 0;" />
                        ${authMobileMenu}
                    </nav>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const toggleBtn = document.getElementById('header-toggle');
        const menu = document.getElementById('header-menu');
        
        if (toggleBtn && menu) {
            const iconBurger = toggleBtn.querySelector('.icon-burger');
            const iconClose = toggleBtn.querySelector('.icon-close');
            
            toggleBtn.addEventListener('click', () => {
                const isActive = menu.classList.toggle('active');
                if (isActive) {
                    iconBurger.style.display = 'none';
                    iconClose.style.display = 'inline';
                } else {
                    iconBurger.style.display = 'inline';
                    iconClose.style.display = 'none';
                }
            });
        }

        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                authService.logout();
                window.location.reload();
            });
        });

        const handleSearch = (e, inputId) => {
            e.preventDefault();
            const query = document.getElementById(inputId).value.trim();
            if (query) {
                window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
            } else {
                window.location.href = `catalog.html`;
            }
        };

        const formDesktop = document.getElementById('global-search-form-desktop');
        if (formDesktop) formDesktop.addEventListener('submit', (e) => handleSearch(e, 'global-search-input-desktop'));

        const formMobile = document.getElementById('global-search-form-mobile');
        if (formMobile) formMobile.addEventListener('submit', (e) => handleSearch(e, 'global-search-input-mobile'));
    }

    listenToCartEvents() {
        window.addEventListener('cartUpdated', () => {
            const cart = cartService.getCart();
            const counter = document.getElementById('cart-counter');
            if (counter) {
                counter.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            }
        });
    }
}

// Inicializa no carregamento
document.addEventListener('DOMContentLoaded', () => {
    new HeaderComponent();
});
