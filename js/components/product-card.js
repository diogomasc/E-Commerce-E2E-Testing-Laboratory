import { format } from '../utils/format.js';

export const createProductCard = (product) => {
    const card = document.createElement('div');
    card.className = 'card product-card';
    card.dataset.testid = `product-card-${product.id}`;
    
    // Navega para product.html passando o ID via parametros da URL
    const detailUrl = `product.html?id=${product.id}`;

    card.innerHTML = `
        <a href="${detailUrl}" data-testid="product-card-link-${product.id}">
            <img src="${product.images[0]}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover;" data-testid="product-image-${product.id}">
            <div style="padding: var(--spacing-md);">
                <span class="badge" style="margin-bottom: var(--spacing-sm);" data-testid="product-category-${product.id}">${product.category}</span>
                <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-xs); color: var(--color-text);" data-testid="product-title-${product.id}">${product.title}</h3>
                <p style="color: var(--color-text-light); font-size: var(--font-size-sm); margin-bottom: var(--spacing-sm);" data-testid="product-desc-${product.id}">${product.description.substring(0, 50)}...</p>
                <div style="font-size: var(--font-size-xl); font-weight: bold; color: var(--color-primary);" data-testid="product-price-${product.id}">${format.currency(product.price)}</div>
            </div>
        </a>
    `;

    return card;
};
