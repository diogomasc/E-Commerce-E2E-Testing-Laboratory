import { authService } from '../services/auth.service.js';
import { validation } from '../utils/validation.js';

class RegisterPage {
    constructor() {
        if (authService.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        this.form = document.getElementById('register-form');
        this.bindEvents();
    }

    bindEvents() {
        if (!this.form) return;

        const inputs = [
            'register-firstname',
            'register-lastname',
            'register-email',
            'register-password',
            'register-confirm-password'
        ];

        // Corte automatico de tamanho maximo
        ['register-firstname', 'register-lastname'].forEach(id => {
            const el = document.getElementById(id);
            if(el) {
                el.addEventListener('input', () => validation.cutAtMax(el, 30));
            }
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clearErrors(inputs);

            let hasError = false;

            Array.from(this.form.elements).forEach(el => {
                if (el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA') return;

                if (el.checkValidity && !el.checkValidity()) {
                    hasError = true;
                    let msg = 'Campo inválido';
                    if (el.validity.valueMissing) {
                        msg = 'Campo obrigatório';
                    } else if (el.validity.typeMismatch && el.type === 'email') {
                        msg = 'E-mail inválido. Formato esperado: email@dominio.com';
                    } else if (el.validity.tooShort) {
                        msg = `Mínimo de ${el.minLength} caracteres`;
                    }
                    this.showError(el.id, msg);
                }
            });
            
            const firstname = document.getElementById('register-firstname').value.trim();
            const lastname = document.getElementById('register-lastname').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (!document.getElementById('register-firstname').classList.contains('is-invalid') && (!validation.isMinLength(firstname, 2) || !validation.isMaxLength(firstname, 50))) {
                this.showError('register-firstname', 'Deve ter entre 2 e 50 caracteres');
                hasError = true;
            }

            if (!document.getElementById('register-lastname').classList.contains('is-invalid') && (!validation.isMinLength(lastname, 2) || !validation.isMaxLength(lastname, 200))) {
                this.showError('register-lastname', 'Deve ter entre 2 e 200 caracteres');
                hasError = true;
            }

            if (!document.getElementById('register-email').classList.contains('is-invalid') && !validation.isEmail(email)) {
                this.showError('register-email', 'E-mail inválido. Formato esperado: email@dominio.com');
                hasError = true;
            }

            if (!document.getElementById('register-password').classList.contains('is-invalid') && !validation.isMinLength(password, 6)) {
                this.showError('register-password', 'Mínimo 6 caracteres');
                hasError = true;
            }

            if (!document.getElementById('register-confirm-password').classList.contains('is-invalid') && password !== confirmPassword) {
                this.showError('register-confirm-password', 'Senhas não conferem');
                hasError = true;
            }

            if (hasError) return;

            const result = authService.register({
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: password
            });

            if (result.success) {
                // Login automatico ou redirecionamento para login
                authService.login(email, password);
                window.location.href = 'index.html';
            } else {
                this.showError('register-email', result.message);
            }
        });
    }

    showError(inputId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(`${inputId}-error`);
        if (input) input.classList.add('is-invalid');
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }

    clearErrors(inputs) {
        inputs.forEach(id => {
            const input = document.getElementById(id);
            const error = document.getElementById(`${id}-error`);
            if (input) input.classList.remove('is-invalid');
            if (error) error.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RegisterPage();
});
