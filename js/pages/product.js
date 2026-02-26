import { productService } from '../services/product.service.js';
import { cartService } from '../services/cart.service.js';
import { format } from '../utils/format.js';

class ProductPage {
    constructor() {
        this.container = document.getElementById('product-container');
        this.errorMsg = document.getElementById('product-error');
        this.selectedSize = null;
        this.selectedColor = null;

        this.init();
    }

    init() {
        if (!this.container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        const product = productService.getById(productId);

        if (!product) {
            this.container.style.display = 'none';
            if (this.errorMsg) this.errorMsg.style.display = 'block';
            return;
        }

        this.product = product;
        
        // Seleciona o primeiro disponivel por padrao
        if (product.sizes?.length) this.selectedSize = product.sizes[0];
        if (product.colors?.length) this.selectedColor = product.colors[0];

        this.render();
        this.bindEvents();
    }

    render() {
        const { product, selectedSize, selectedColor } = this;

        const sizesHtml = product.sizes.map(size => `
            <button type="button" class="btn ${size === selectedSize ? 'btn--primary' : 'btn--outline'} size-btn" data-size="${size}" data-testid="size-${size}">
                ${size}
            </button>
        `).join('');

        const colorsHtml = product.colors.map(color => `
            <button type="button" class="btn ${color === selectedColor ? 'btn--primary' : 'btn--outline'} color-btn" data-color="${color}" data-testid="color-${color.replace(/\s+/g, '-')}">
                ${color}
            </button>
        `).join('');

        this.container.innerHTML = `
            <div>
                <img src="${product.images[0]}" alt="${product.title}" class="product-image" id="main-product-image" data-testid="product-detail-image">
                <div class="product-gallery">
                    ${product.images.map((img, i) => `
                        <img src="${img}" class="${i === 0 ? 'active' : ''}" data-testid="product-gallery-img-${i}">
                    `).join('')}
                </div>
            </div>
            
            <div style="padding: var(--spacing-md) 0;">
                <span class="badge" data-testid="product-detail-category">${product.category}</span>
                <h1 style="margin: var(--spacing-sm) 0; font-size: var(--font-size-xxl);" data-testid="product-detail-title">${product.title}</h1>
                <p style="color: var(--color-text-light); margin-bottom: var(--spacing-lg);" data-testid="product-detail-desc">${product.description}</p>
                
                <div style="font-size: 2rem; font-weight: bold; color: var(--color-primary); margin-bottom: var(--spacing-lg);" data-testid="product-detail-price">
                    ${format.currency(product.price)}
                </div>

                <div style="margin-bottom: var(--spacing-md);">
                    <h4 style="margin-bottom: var(--spacing-sm);" data-testid="product-sizes-title">Tamanho</h4>
                    <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                        ${sizesHtml}
                    </div>
                </div>

                <div style="margin-bottom: var(--spacing-lg);">
                    <h4 style="margin-bottom: var(--spacing-sm);" data-testid="product-colors-title">Cor</h4>
                    <div style="display: flex; gap: var(--spacing-sm); flex-wrap: wrap;">
                        ${colorsHtml}
                    </div>
                </div>

                <button id="add-to-cart-btn" class="btn btn--primary" style="width: 100%; padding: var(--spacing-md); font-size: var(--font-size-lg);" data-testid="add-to-cart-btn">
                    Adicionar ao Carrinho
                </button>
                <div id="add-to-cart-feedback" data-testid="add-to-cart-feedback" style="display: none; color: var(--color-success); margin-top: var(--spacing-sm); font-weight: bold; text-align: center;">
                    Produto adicionado!
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Delegacao de eventos para tamanhos e cores
        this.container.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.product-gallery')) {
                const mainImg = document.getElementById('main-product-image');
                mainImg.src = e.target.src;
                
                // Atualiza a classe ativa
                this.container.querySelectorAll('.product-gallery img').forEach(img => img.classList.remove('active'));
                e.target.classList.add('active');
            }
            if (e.target.classList.contains('size-btn')) {
                this.selectedSize = e.target.getAttribute('data-size');
                this.render(); // Simple re-render to update classes
            }
            if (e.target.classList.contains('color-btn')) {
                this.selectedColor = e.target.getAttribute('data-color');
                this.render();
            }
            if (e.target.id === 'add-to-cart-btn') {
                this.addToCart();
            }
        });
    }

    addToCart() {
        cartService.addItem(this.product.id, this.selectedSize, this.selectedColor);
        
        const feedback = document.getElementById('add-to-cart-feedback');
        if (feedback) {
            feedback.style.display = 'block';
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});
