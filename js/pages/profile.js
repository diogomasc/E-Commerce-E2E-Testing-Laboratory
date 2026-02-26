import { authService } from '../services/auth.service.js';
import { orderService } from '../services/order.service.js';
import { format } from '../utils/format.js';

class ProfilePage {
    constructor() {
        this.user = authService.getCurrentUser();
        if (!this.user) {
            window.location.href = 'login.html';
            return;
        }

        this.init();
    }

    init() {
        document.getElementById('profile-name').textContent = `${this.user.firstName} ${this.user.lastName}`;
        document.getElementById('profile-email').textContent = this.user.email;

        const orders = orderService.getOrdersForUser(this.user.email);
        const list = document.getElementById('profile-orders-list');

        if (!list) return;

        if (orders.length === 0) {
            list.innerHTML = '<p data-testid="profile-no-orders">Você ainda não possui pedidos em seu histórico.</p>';
            return;
        }

        list.innerHTML = orders.map((order, index) => `
            <div style="border: 1px solid var(--color-border); padding: var(--spacing-md); border-radius: var(--border-radius-md); margin-bottom: var(--spacing-md);" data-testid="profile-order-card-${index}">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                    <strong data-testid="profile-order-id-${index}">Pedido: ${order.id}</strong>
                    <span style="color: var(--color-text-light);" data-testid="profile-order-date-${index}">${format.date(order.date)}</span>
                </div>
                <div style="font-size: var(--font-size-sm); color: var(--color-text-light); margin-bottom: var(--spacing-sm);" data-testid="profile-order-summary-${index}">
                    ${order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                </div>
                <div style="font-weight: bold; color: var(--color-success);" data-testid="profile-order-total-${index}">
                    Total Pago: ${format.currency(order.total)}
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfilePage();
});
