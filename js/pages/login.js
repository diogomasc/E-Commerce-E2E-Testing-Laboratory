import { authService } from '../services/auth.service.js';

class LoginPage {
    constructor() {
        if (authService.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }
        
        this.form = document.getElementById('login-form');
        this.emailInput = document.getElementById('login-email');
        this.passwordInput = document.getElementById('login-password');
        this.emailError = document.getElementById('login-email-error');
        this.passwordError = document.getElementById('login-password-error');
        
        this.bindEvents();
    }

    bindEvents() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clearErrors();

            const email = this.emailInput.value.trim();
            const password = this.passwordInput.value;

            if (!email) {
                this.showError(this.emailInput, this.emailError, 'E-mail é obrigatório');
                return;
            }

            if (!password) {
                this.showError(this.passwordInput, this.passwordError, 'Senha é obrigatória');
                return;
            }

            const result = authService.login(email, password);

            if (result.success) {
                window.location.href = 'index.html';
            } else {
                this.showError(this.passwordInput, this.passwordError, result.message);
            }
        });
    }

    showError(inputElement, errorElement, message) {
        inputElement.classList.add('is-invalid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearErrors() {
        this.emailInput.classList.remove('is-invalid');
        this.passwordInput.classList.remove('is-invalid');
        if (this.emailError) this.emailError.style.display = 'none';
        if (this.passwordError) this.passwordError.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginPage();
});
