import { productService } from '../services/product.service.js';
import { createProductCard } from '../components/product-card.js';

class HomePage {
    constructor() {
        this.grid = document.getElementById('featured-products-grid');
        this.init();
    }

    init() {
        if (!this.grid) return;

        // Pega os 4 primeiros produtos como destaque
        const featuredProducts = productService.getAll().slice(0, 4);
        
        featuredProducts.forEach(product => {
            const card = createProductCard(product);
            this.grid.appendChild(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
