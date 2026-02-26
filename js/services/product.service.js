import { products } from '../data/products.js';

class ProductService {
    getAll() {
        return [...products];
    }

    getById(id) {
        return products.find(p => p.id === id);
    }

    search(query, category, sort) {
        let result = this.getAll();

        if (category) {
            result = result.filter(p => p.category === category);
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(lowerQuery) || 
                p.description.toLowerCase().includes(lowerQuery)
            );
        }

        if (sort === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }
}

export const productService = new ProductService();
