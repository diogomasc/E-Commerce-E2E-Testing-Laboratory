import { storage, CONSTANTS } from '../utils/storage.js';
import { defaultUsers } from '../data/users.js';

class AuthService {
    constructor() {
        if (!storage.get(CONSTANTS.USERS_KEY)) {
            storage.set(CONSTANTS.USERS_KEY, defaultUsers);
        }
    }

    login(email, password) {
        const users = storage.get(CONSTANTS.USERS_KEY) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            storage.set(CONSTANTS.CURRENT_USER_KEY, user);
            return { success: true, user };
        }
        return { success: false, message: "E-mail ou senha incorretos." };
    }

    register(userData) {
        const users = storage.get(CONSTANTS.USERS_KEY) || [];
        
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: "E-mail já está em uso." };
        }

        const newUser = {
            ...userData,
            id: `usr-${Date.now()}`,
            orders: []
        };

        users.push(newUser);
        storage.set(CONSTANTS.USERS_KEY, users);
        
        return { success: true };
    }

    logout() {
        storage.remove(CONSTANTS.CURRENT_USER_KEY);
    }

    getCurrentUser() {
        return storage.get(CONSTANTS.CURRENT_USER_KEY);
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}

export const authService = new AuthService();
