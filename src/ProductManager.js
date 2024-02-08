const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newProduct = { ...product, id: this.generateId(products) };
            products.push(newProduct);
            await this.saveProducts(products);
            return newProduct;
        } catch (error) {
            throw new Error('Error adding product: ' + error.message);
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                throw new Error('Error reading products: ' + error.message);
            }
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id) || null;
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields, id };
                await this.saveProducts(products);
                return products[index];
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const filteredProducts = products.filter(product => product.id !== id);
            await this.saveProducts(filteredProducts);
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }

    async saveProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }

    generateId(products) {
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }
}

module.exports = ProductManager;
