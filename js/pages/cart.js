import { cartService } from '../services/cart.service.js';
import { format } from '../utils/format.js';

class CartPage {
    constructor() {
        this.listContainer = document.getElementById('cart-items-list');
        this.emptyMsg = document.getElementById('cart-empty-message');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.couponBtn = document.getElementById('apply-coupon-btn');
        this.couponInput = document.getElementById('cart-coupon');
        this.couponMsg = document.getElementById('coupon-message');
        this.obsInput = document.getElementById('cart-observation');
        
        this.init();
    }

    init() {
        if (!this.listContainer) return;
        this.render();
        this.bindEvents();
        
        // Ouve mudancas globais caso multiplas abas estejam abertas ou itens sejam modificados estruturalmente
        window.addEventListener('cartUpdated', () => this.render());
    }

    render() {
        const cart = cartService.getCart();
        const items = cart.items;

        if (items.length === 0) {
            this.listContainer.style.display = 'none';
            this.emptyMsg.style.display = 'block';
            if (this.checkoutBtn) this.checkoutBtn.disabled = true;
        } else {
            this.listContainer.style.display = 'block';
            this.emptyMsg.style.display = 'none';
            if (this.checkoutBtn) this.checkoutBtn.disabled = false;

            this.listContainer.innerHTML = items.map((item, idx) => `
                <div class="cart-item" data-testid="cart-item-${idx}">
                    <img src="${item.image}" alt="${item.title}" data-testid="cart-item-image-${idx}">
                    <div class="cart-item-details">
                        <h4 data-testid="cart-item-title-${idx}">${item.title}</h4>
                        <p style="font-size: var(--font-size-sm); color: var(--color-text-light);" data-testid="cart-item-variant-${idx}">Tab: ${item.size} | Cor: ${item.color}</p>
                        <div style="font-weight: bold; color: var(--color-primary);" data-testid="cart-item-price-${idx}">${format.currency(item.price)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
                        <button class="btn btn--outline qt-minus" data-idx="${idx}" data-testid="cart-item-minus-${idx}" style="padding: 2px 8px;">-</button>
                        <span data-testid="cart-item-quantity-${idx}">${item.quantity}</span>
                        <button class="btn btn--outline qt-plus" data-idx="${idx}" data-testid="cart-item-plus-${idx}" style="padding: 2px 8px;">+</button>
                    </div>
                    <button class="btn remove-item" data-idx="${idx}" data-testid="cart-item-remove-${idx}" style="color: var(--color-error); font-weight: bold; margin-left: var(--spacing-md);" title="Remover">X</button>
                </div>
            `).join('');
        }

        this.updateSummary(cart);

        // Preenche a observacao caso estivesse salva localmente
        // Ignorando por enquanto, mantendo estrito ao DOM ate o checkout
    }

    updateSummary(cart) {
        document.getElementById('cart-subtotal').textContent = format.currency(cartService.getSubtotal(cart));
        document.getElementById('cart-discount').textContent = `- ${format.currency(cartService.getDiscount(cart))}`;
        document.getElementById('cart-total').textContent = format.currency(cartService.getTotal(cart));

        if (cart.coupon && this.couponInput) {
            this.couponInput.value = cart.coupon.code;
            this.couponMsg.textContent = "Cupom aplicado com sucesso!";
            this.couponMsg.style.color = "var(--color-success)";
            this.couponMsg.style.display = 'block';
        }
    }

    bindEvents() {
        this.listContainer.addEventListener('click', (e) => {
            const cart = cartService.getCart();
            const btn = e.target.closest('button');
            if (!btn) return;

            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            const item = cart.items[idx];
            if (!item) return;

            if (btn.classList.contains('qt-minus')) {
                cartService.updateQuantity(item.productId, item.size, item.color, item.quantity - 1);
            } else if (btn.classList.contains('qt-plus')) {
                cartService.updateQuantity(item.productId, item.size, item.color, item.quantity + 1);
            } else if (btn.classList.contains('remove-item')) {
                cartService.removeItem(item.productId, item.size, item.color);
            }
        });

        if (this.couponBtn && this.couponInput) {
            this.couponBtn.addEventListener('click', () => {
                const code = this.couponInput.value.trim();
                if (!code) {
                    cartService.removeCoupon();
                    this.couponMsg.style.display = 'none';
                    return;
                }

                const result = cartService.applyCoupon(code);
                if (!result.success) {
                    this.couponMsg.textContent = result.message;
                    this.couponMsg.style.color = "var(--color-error)";
                    this.couponMsg.style.display = 'block';
                } else {
                    this.couponMsg.textContent = "Cupom aplicado!";
                    this.couponMsg.style.color = "var(--color-success)";
                    this.couponMsg.style.display = 'block';
                }
            });
        }

        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => {
                // Estamos salvando a observacao na storage para passar ao checkout se necessario,
                // ou apenas storage local. Usaremos o utilitario temporariamente para o fluxo.
                const obs = this.obsInput ? this.obsInput.value : '';
                sessionStorage.setItem('e2e_cart_obs', obs);
                window.location.href = 'checkout.html';
            });
        }

        if (this.obsInput) {
            this.obsInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});
