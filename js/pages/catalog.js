import { productService } from '../services/product.service.js';
import { createProductCard } from '../components/product-card.js';

class CatalogPage {
    constructor() {
        this.productList = document.getElementById('product-list');
        this.noProductsMsg = document.getElementById('no-products-message');
        
        this.searchInput = document.getElementById('filter-search');
        this.categorySelect = document.getElementById('filter-category');
        this.sortSelect = document.getElementById('sort-price');

        this.init();
    }

    init() {
        if (!this.productList) return;

        // Analisa parametros da URL para busca inicial
        const urlParams = new URLSearchParams(window.location.search);
        const urlQuery = urlParams.get('search');
        
        if (urlQuery && this.searchInput) {
            this.searchInput.value = urlQuery;
        }

        this.bindEvents();
        this.renderProducts();
    }

    bindEvents() {
        if (this.searchInput) {
            // Debounce para busca poderia ser implementado, usando input simples para E2E
            this.searchInput.addEventListener('input', () => this.renderProducts());
        }

        if (this.categorySelect) {
            this.categorySelect.addEventListener('change', () => this.renderProducts());
        }

        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.renderProducts());
        }
    }

    renderProducts() {
        this.productList.innerHTML = '';
        
        const query = this.searchInput ? this.searchInput.value : '';
        const category = this.categorySelect ? this.categorySelect.value : '';
        const sort = this.sortSelect ? this.sortSelect.value : '';

        const products = productService.search(query, category, sort);

        if (products.length === 0) {
            this.noProductsMsg.style.display = 'block';
        } else {
            this.noProductsMsg.style.display = 'none';
            products.forEach(p => {
                this.productList.appendChild(createProductCard(p));
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CatalogPage();
});
