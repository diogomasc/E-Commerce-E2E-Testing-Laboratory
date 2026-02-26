import { storage, CONSTANTS } from '../utils/storage.js';
import { coupons } from '../data/coupons.js';
import { products } from '../data/products.js';

class CartService {
    getCart() {
        return storage.get(CONSTANTS.CART_KEY) || { items: [], coupon: null };
    }

    saveCart(cart) {
        storage.set(CONSTANTS.CART_KEY, cart);
        // Dispara evento customizado para notificar outros componentes (ex: Header)
        window.dispatchEvent(new Event('cartUpdated'));
    }

    addItem(productId, size, color) {
        const cart = this.getCart();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;

        const existingItemIndex = cart.items.findIndex(
            item => item.productId === productId && item.size === size && item.color === color
        );

        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += 1;
        } else {
            cart.items.push({
                productId,
                title: product.title,
                price: product.price,
                image: product.images[0],
                size,
                color,
                quantity: 1
            });
        }

        this.validateCoupon(cart);
        this.saveCart(cart);
    }

    updateQuantity(productId, size, color, quantity) {
        const cart = this.getCart();
        const itemIndex = cart.items.findIndex(
            item => item.productId === productId && item.size === size && item.color === color
        );

        if (itemIndex >= 0) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            this.validateCoupon(cart);
            this.saveCart(cart);
        }
    }

    removeItem(productId, size, color) {
        this.updateQuantity(productId, size, color, 0);
    }

    applyCoupon(code) {
        const cart = this.getCart();
        const total = this.getSubtotal(cart);
        const coupon = coupons.find(c => c.code === code.toUpperCase());

        if (!coupon) {
            return { success: false, message: "Cupom inválido." };
        }

        if (total < coupon.minPurchase) {
            return { success: false, message: `Compra mínima de R$ ${coupon.minPurchase} para este cupom.` };
        }

        cart.coupon = coupon;
        this.saveCart(cart);
        return { success: true };
    }

    removeCoupon() {
        const cart = this.getCart();
        cart.coupon = null;
        this.saveCart(cart);
    }

    validateCoupon(cart) {
        if (cart.coupon) {
            const subtotal = this.getSubtotal(cart);
            if (subtotal < cart.coupon.minPurchase) {
                cart.coupon = null; // Automatically remove if below minimum
            }
        }
    }

    getSubtotal(cart = this.getCart()) {
        return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getTotal(cart = this.getCart()) {
        const subtotal = this.getSubtotal(cart);
        const discount = cart.coupon ? cart.coupon.discount : 0;
        return Math.max(0, subtotal - discount);
    }

    getDiscount(cart = this.getCart()) {
        if (!cart.coupon) return 0;
        const subtotal = this.getSubtotal(cart);
        return subtotal >= cart.coupon.minPurchase ? cart.coupon.discount : 0;
    }

    clearCart() {
        this.saveCart({ items: [], coupon: null });
    }
}

export const cartService = new CartService();
