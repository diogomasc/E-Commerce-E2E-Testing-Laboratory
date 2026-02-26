import { storage, CONSTANTS } from '../utils/storage.js';
import { authService } from './auth.service.js';
import { cartService } from './cart.service.js';

class OrderService {
    constructor() {
        if (!storage.get(CONSTANTS.ORDERS_KEY)) {
            storage.set(CONSTANTS.ORDERS_KEY, []);
        }
    }

    createOrder(checkoutData) {
        const cart = cartService.getCart();
        
        if (!cart || cart.items.length === 0) {
            return { success: false, message: "Carrinho vazio." };
        }

        const subtotal = cartService.getSubtotal(cart);
        const discount = cartService.getDiscount(cart);
        const total = cartService.getTotal(cart);

        const order = {
            id: `ord-${Date.now()}`,
            date: new Date().toISOString(),
            status: 'COMPLETED',
            items: cart.items,
            subtotal,
            discount,
            total,
            coupon: cart.coupon,
            observation: checkoutData.observation,
            shippingAddress: {
                cep: checkoutData.cep,
                address: checkoutData.address,
                complement: checkoutData.complement,
                city: checkoutData.city,
                state: checkoutData.state
            },
            customer: {
                firstname: checkoutData.firstname,
                lastname: checkoutData.lastname,
                email: checkoutData.email,
                cpf: checkoutData.cpf,
                phone: checkoutData.phone
            }
        };

        // Salva o pedido globalmente
        const orders = storage.get(CONSTANTS.ORDERS_KEY) || [];
        orders.push(order);
        storage.set(CONSTANTS.ORDERS_KEY, orders);

        // Mapeia para o usuario se estiver logado
        const user = authService.getCurrentUser();
        if (user) {
            user.orders.push(order);
            // Atualizando lista de usuarios no storage
            const users = storage.get(CONSTANTS.USERS_KEY) || [];
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex >= 0) {
                users[userIndex] = user;
                storage.set(CONSTANTS.USERS_KEY, users);
            }
            storage.set(CONSTANTS.CURRENT_USER_KEY, user);
        }

        // Limpa o carrinho
        cartService.clearCart();

        return { success: true, orderId: order.id };
    }

    getOrderById(id) {
        const orders = storage.get(CONSTANTS.ORDERS_KEY) || [];
        return orders.find(o => o.id === id);
    }

    getOrdersForUser(email) {
        const orders = storage.get(CONSTANTS.ORDERS_KEY) || [];
        return orders.filter(o => o.customer.email === email);
    }
}

export const orderService = new OrderService();
