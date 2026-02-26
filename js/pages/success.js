import { orderService } from '../services/order.service.js';
import { authService } from '../services/auth.service.js';
import { format } from '../utils/format.js';

class SuccessPage {
    constructor() {
        this.container = document.querySelector('.card');
        this.init();
    }

    init() {
        if (!this.container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');

        if (!orderId) {
            window.location.href = 'index.html';
            return;
        }

        const order = orderService.getOrderById(orderId);

        if (!order) {
            this.container.innerHTML = `
                <h1 style="color: var(--color-error);" data-testid="error-title">Pedido não encontrado</h1>
                <a href="index.html" class="btn btn--primary" style="margin-top: var(--spacing-lg);">Voltar à Página Inicial</a>
            `;
            return;
        }

        this.render(order);
    }

    render(order) {
        document.getElementById('success-order-id').textContent = order.id;
        
        const list = document.getElementById('success-items-list');
        if (list) {
            list.innerHTML = order.items.map(item => `
                <li style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-xs);" data-testid="success-item-${item.productId}">
                    <span>${item.quantity}x ${item.title}</span>
                    <span>${format.currency(item.price * item.quantity)}</span>
                </li>
            `).join('');
        }

        document.getElementById('success-total').textContent = format.currency(order.total);

        const user = authService.getCurrentUser();
        if (!user) {
            const warningHtml = `
                <div style="background-color: #fff3cd; color: #856404; padding: var(--spacing-md); border-radius: var(--border-radius-md); margin-top: var(--spacing-lg); text-align: left; border: 1px solid #ffeeba;" data-testid="guest-warning">
                    <h4 style="margin-bottom: var(--spacing-xs);">Aviso Importante</h4>
                    <p style="font-size: var(--font-size-sm);">Você finalizou esta compra como <strong>visitante</strong>. Por favor, <strong>anote o número do pedido (${order.id})</strong> para consultar posteriormente informações como previsão de entrega e abrir disputas. Você não possuirá histórico de compras em nosso sistema sem uma conta.</p>
                </div>
            `;
            // Inserir antes do botao de voltar
            const backBtn = document.querySelector('[data-testid="back-to-home-btn"]');
            if (backBtn && backBtn.parentElement) {
                backBtn.insertAdjacentHTML('beforebegin', warningHtml);
                backBtn.style.marginTop = 'var(--spacing-lg)';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SuccessPage();
});
