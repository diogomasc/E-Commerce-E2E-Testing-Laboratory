import { authService } from '../services/auth.service.js';
import { orderService } from '../services/order.service.js';
import { applyMask, masks } from '../utils/masks.js';
import { validation } from '../utils/validation.js';
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
        
        this.initAddressSection();

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

    initAddressSection() {
        this.addressView = document.getElementById('profile-address-view');
        this.addressForm = document.getElementById('profile-address-form');
        this.addressDetails = document.getElementById('profile-address-details');
        this.addressEmpty = document.querySelector('[data-testid="profile-address-empty"]');
        
        applyMask('#address-cep', masks.cep);
        const cepInput = document.getElementById('address-cep');
        if (cepInput && cepInput.maxLength) {
            cepInput.addEventListener('input', () => validation.cutAtMax(cepInput, cepInput.maxLength));
        }

        this.renderAddress();
        this.bindAddressEvents();
    }

    renderAddress() {
        if (this.user.address) {
            this.addressEmpty.style.display = 'none';
            this.addressDetails.style.display = 'flex';
            document.getElementById('view-address-cep').textContent = this.user.address.cep;
            document.getElementById('view-address-street').textContent = this.user.address.street;
            document.getElementById('view-address-city-state').textContent = `${this.user.address.city}/${this.user.address.state}`;
            
            const complement = document.getElementById('view-address-complement');
            const complementWrapper = document.getElementById('view-address-complement-wrapper');
            if (this.user.address.complement) {
                complement.textContent = this.user.address.complement;
                complementWrapper.style.display = 'block';
            } else {
                complementWrapper.style.display = 'none';
            }
        } else {
            this.addressEmpty.style.display = 'block';
            this.addressDetails.style.display = 'none';
        }
    }

    bindAddressEvents() {
        const editBtn = document.getElementById('profile-address-edit-btn');
        const cancelBtn = document.getElementById('profile-address-cancel-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.addressView.style.display = 'none';
                this.addressForm.style.display = 'block';
                editBtn.style.display = 'none';

                if (this.user.address) {
                    document.getElementById('address-cep').value = this.user.address.cep;
                    document.getElementById('address-street').value = this.user.address.street;
                    document.getElementById('address-city').value = this.user.address.city;
                    document.getElementById('address-state').value = this.user.address.state;
                    document.getElementById('address-complement').value = this.user.address.complement || '';
                }
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.addressForm.style.display = 'none';
                this.addressView.style.display = 'block';
                editBtn.style.display = 'block';
            });
        }

        if (this.addressForm) {
            this.addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAddress();
            });
        }
    }

    saveAddress() {
        const addressData = {
            cep: document.getElementById('address-cep').value,
            street: document.getElementById('address-street').value,
            city: document.getElementById('address-city').value,
            state: document.getElementById('address-state').value,
            complement: document.getElementById('address-complement').value
        };

        if (!validation.isValidCEP(addressData.cep)) {
            alert("CEP inválido");
            return;
        }

        const result = authService.saveAddress(this.user.email, addressData);
        
        if (result.success) {
            // Update local user reference
            this.user.address = addressData;
            
            this.renderAddress();
            this.addressForm.style.display = 'none';
            this.addressView.style.display = 'block';
            document.getElementById('profile-address-edit-btn').style.display = 'block';
            
            // alert('Endereço salvo com sucesso!'); // Optional feedback
        } else {
            alert('Erro ao salvar endereço.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfilePage();
});
