class FooterComponent {
    constructor() {
        this.container = document.getElementById('main-footer');
        if (this.container) {
            this.render();
        }
    }

    render() {
        this.container.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 var(--spacing-md);">
                <p data-testid="footer-text">© ${new Date().getFullYear()} E2E Store - Ambiente para testes automatizados | Por Diogo Mascarenhas | <a href="https://www.linkedin.com/in/diogomasc/" target="_blank">LinkedIn</a></p>
                <div style="margin-top: var(--spacing-sm); display: flex; gap: var(--spacing-md); justify-content: center; font-size: var(--font-size-sm);">
                    <span data-testid="footer-version">Versão 1.0.0</span>
                    <span data-testid="footer-env">Vanilla JS / LocalStorage</span>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FooterComponent();
});
