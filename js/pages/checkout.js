import { authService } from '../services/auth.service.js';
import { cartService } from '../services/cart.service.js';
import { orderService } from '../services/order.service.js';
import { validation } from '../utils/validation.js';
import { applyMask, masks } from '../utils/masks.js';
import { format } from '../utils/format.js';

class CheckoutPage {
    constructor() {
        this.form = document.getElementById('checkout-form');
        this.cart = cartService.getCart();

        if (!this.form) return;

        if (this.cart.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        this.init();
    }

    init() {
        this.renderSummary();
        this.applyMasks();
        this.prefillUser();
        this.bindEvents();
    }

    renderSummary() {
        const list = document.getElementById('checkout-items-list');
        list.innerHTML = this.cart.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-xs); font-size: var(--font-size-sm);" data-testid="checkout-item-${item.productId}">
                <span>${item.quantity}x ${item.title}</span>
                <span>${format.currency(item.price * item.quantity)}</span>
            </div>
        `).join('');

        document.getElementById('checkout-subtotal').textContent = format.currency(cartService.getSubtotal(this.cart));
        document.getElementById('checkout-discount').textContent = `- ${format.currency(cartService.getDiscount(this.cart))}`;
        document.getElementById('checkout-total').textContent = format.currency(cartService.getTotal(this.cart));
    }

    applyMasks() {
        applyMask('#checkout-cpf', masks.cpf);
        applyMask('#checkout-phone', masks.phone);
        applyMask('#checkout-cep', masks.cep);
        applyMask('#checkout-card-number', masks.cardNumber);
        applyMask('#checkout-card-expiry', masks.cardExpiry);

        // Restricoes adicionais de tamanho aplicadas via atributos e JS
        ['checkout-cpf', 'checkout-phone', 'checkout-cep', 'checkout-card-number', 'checkout-card-expiry', 'checkout-card-cvv'].forEach(id => {
            const el = document.getElementById(id);
            if(el && el.maxLength) {
                el.addEventListener('input', () => validation.cutAtMax(el, el.maxLength));
            }
        });
    }

    prefillUser() {
        const user = authService.getCurrentUser();
        if (user) {
            document.getElementById('checkout-firstname').value = user.firstName;
            document.getElementById('checkout-lastname').value = user.lastName;
            document.getElementById('checkout-email').value = user.email;
            
            if (user.address) {
                document.getElementById('checkout-cep').value = user.address.cep;
                document.getElementById('checkout-address').value = user.address.street;
                document.getElementById('checkout-city').value = user.address.city;
                document.getElementById('checkout-state').value = user.address.state;
                document.getElementById('checkout-complement').value = user.address.complement || '';
            }
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clearErrors();

            if (this.validateForm()) {
                this.submitOrder();
            }
        });
    }

    validateForm() {
        let isValid = true;

        // Informacoes Basicas
        const email = document.getElementById('checkout-email');
        const cpf = document.getElementById('checkout-cpf');
        const cep = document.getElementById('checkout-cep');
        const expiry = document.getElementById('checkout-card-expiry');
        const cvv = document.getElementById('checkout-card-cvv');

        if (!validation.isEmail(email.value)) {
            this.showError('checkout-email', 'E-mail inválido');
            isValid = false;
        }

        if (!validation.isValidCPF(cpf.value)) {
            this.showError('checkout-cpf', 'CPF inválido');
            isValid = false;
        }

        if (!validation.isValidCEP(cep.value)) {
            this.showError('checkout-cep', 'CEP inválido');
            isValid = false;
        }

        if (!validation.isValidExpiry(expiry.value)) {
            this.showError('checkout-card-expiry', 'Data inválida. Use MM/AA');
            isValid = false;
        }

        if (!validation.isValidCVV(cvv.value)) {
            this.showError('checkout-card-cvv', 'CVV inválido');
            isValid = false;
        }

        return isValid;
    }

    showError(inputId, message) {
        const input = document.getElementById(inputId);
        const error = document.querySelector(`[data-testid="${inputId}-error"]`) 
            || document.getElementById(`${inputId}-error`); // fallback if exists
            
        if (input) input.classList.add('is-invalid');
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
            error.classList.add('form-error');
        } else {
                 // fallback pragmatico criando no de erro caso nao esteja mapeado no HTML
            const span = document.createElement('span');
            span.className = 'form-error';
            span.dataset.testid = `${inputId}-error`;
            span.textContent = message;
            span.style.display = 'block';
            input.parentNode.appendChild(span);
        }
    }

    clearErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    }

    submitOrder() {
        const checkoutData = {
            firstname: document.getElementById('checkout-firstname').value,
            lastname: document.getElementById('checkout-lastname').value,
            email: document.getElementById('checkout-email').value,
            cpf: document.getElementById('checkout-cpf').value,
            phone: document.getElementById('checkout-phone').value,
            cep: document.getElementById('checkout-cep').value,
            address: document.getElementById('checkout-address').value,
            complement: document.getElementById('checkout-complement').value,
            city: document.getElementById('checkout-city').value,
            state: document.getElementById('checkout-state').value,
            observation: sessionStorage.getItem('e2e_cart_obs') || ''
        };

        const result = orderService.createOrder(checkoutData);

        if (result.success) {
            sessionStorage.removeItem('e2e_cart_obs');
            window.location.href = `success.html?orderId=${result.orderId}`;
        } else {
            alert('Erro ao processar pedido: ' + result.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CheckoutPage();
});
