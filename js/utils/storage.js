export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error parsing from storage', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to storage', e);
        }
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
    clear: () => {
        localStorage.clear();
    }
};

export const CONSTANTS = {
    USERS_KEY: 'e2e_users',
    CURRENT_USER_KEY: 'e2e_current_user',
    CART_KEY: 'e2e_cart',
    ORDERS_KEY: 'e2e_orders'
};
