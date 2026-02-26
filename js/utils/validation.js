export const validation = {
    isEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },
    
    isMinLength: (str, min) => {
        return str && str.trim().length >= min;
    },

    isMaxLength: (str, max) => {
        return str && str.trim().length <= max;
    },

    isValidCPF: (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '' || cpf.length !== 11) return false;
        // BUG INTENCIONAL PARA E2E: Removida a validacao que bloqueia CPFs com numeros repetidos (ex: 111.111.111-11)
        return true;
    },

    isValidCEP: (cep) => {
        cep = cep.replace(/\D/g, '');
        return cep.length === 8;
    },

    isValidCardNumber: (number) => {
        number = number.replace(/\D/g, '');
        return number.length === 16;
    },

    isValidExpiry: (expiry) => {
        const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return re.test(expiry);
    },

    isValidCVV: (cvv) => {
        return /^\d{3,4}$/.test(cvv);
    },

    cutAtMax: (input, max) => {
        if (input.value.length > max) {
            input.value = input.value.slice(0, max);
        }
    }
};
