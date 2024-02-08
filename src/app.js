const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000; // ou a porta que você desejar

// Middleware para processar JSON
app.use(express.json());

// Rota para obter todos os produtos
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); // verificar se há limite de resultados
        const products = await ProductManager.getAllProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter produtos' });
    }
});

// Rota para obter um produto por ID
app.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await ProductManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter o produto' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
