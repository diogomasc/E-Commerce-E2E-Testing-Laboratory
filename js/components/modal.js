class Modal {
    constructor() {
        this.overlay = null;
        this.modal = null;
        this.createElements();
    }

    createElements() {
        if (document.getElementById('generic-modal-overlay')) return;

        this.overlay = document.createElement('div');
        this.overlay.id = 'generic-modal-overlay';
        this.overlay.className = 'modal-overlay';
        
        this.modal = document.createElement('div');
        this.modal.className = 'modal-card card';
        
        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        this.bindEvents();
    }

    bindEvents() {
        if (!this.overlay) return;
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
    }

    show({ title, body, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel }) {
        if (!this.modal || !this.overlay) this.createElements();

        this.modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" data-testid="modal-close">&times;</button>
            </div>
            <div class="modal-body" data-testid="modal-body">
                ${body}
            </div>
            <div class="modal-footer">
                <button class="btn btn--outline" id="modal-cancel-btn" data-testid="modal-cancel-btn">${cancelText}</button>
                <button class="btn btn--primary" id="modal-confirm-btn" data-testid="modal-confirm-btn">${confirmText}</button>
            </div>
        `;

        const closeBtn = this.modal.querySelector('.modal-close');
        const cancelBtn = this.modal.querySelector('#modal-cancel-btn');
        const confirmBtn = this.modal.querySelector('#modal-confirm-btn');

        const handleClose = () => {
            this.close();
            if (onCancel) onCancel();
        };

        closeBtn.addEventListener('click', handleClose);
        cancelBtn.addEventListener('click', handleClose);
        
        confirmBtn.addEventListener('click', () => {
            if (onConfirm) onConfirm();
            this.close();
        });

        requestAnimationFrame(() => {
            this.overlay.classList.add('active');
            this.modal.classList.add('active');
        });
    }

    close() {
        if (!this.overlay || !this.modal) return;
        this.overlay.classList.remove('active');
        this.modal.classList.remove('active');
        setTimeout(() => {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
                this.overlay = null;
                this.modal = null;
            }
        }, 300); // Duração da transição
    }
}

export const modalService = new Modal();
