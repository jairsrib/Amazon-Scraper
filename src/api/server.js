const express = require('express');
const cors = require('cors');
const config = require('./config');
const { scrapeAmazonProducts, validateKeyword } = require('../utils/scraper');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());

/**
 * Endpoint para scraping de produtos da Amazon
 * GET /api/scrape?keyword=sua-palavra-chave
 */
app.get('/api/scrape', async (req, res) => {
    try {
        const { keyword } = req.query;
        
        // Validação do parâmetro keyword
        if (!validateKeyword(keyword)) {
            return res.status(400).json({
                success: false,
                error: 'Parâmetro "keyword" é obrigatório e deve ter entre 2 e 100 caracteres'
            });
        }
        
        console.log(`🚀 Iniciando scraping para: "${keyword}"`);
        
        // Fazendo o scraping
        const products = await scrapeAmazonProducts(keyword.trim());
        
        // Retornando os resultados
        res.json({
            success: true,
            keyword: keyword.trim(),
            totalProducts: products.length,
            products
        });
        
    } catch (error) {
        console.error('❌ Erro no endpoint /api/scrape:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

/**
 * Endpoint de saúde do servidor
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor Amazon Scraper funcionando corretamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * Endpoint de informações da API
 * GET /api/info
 */
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Amazon Product Scraper API',
        version: '1.0.0',
        description: 'API para extração de produtos da Amazon',
        endpoints: {
            '/api/scrape': 'GET - Extrai produtos por palavra-chave',
            '/api/health': 'GET - Status do servidor',
            '/api/info': 'GET - Informações da API'
        },
        config: {
            maxProducts: config.scraping.maxProducts,
            timeout: config.scraping.timeout,
            amazonDomain: config.amazon.baseUrl
        }
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint não encontrado',
        availableEndpoints: [
            'GET /api/scrape?keyword=sua-palavra-chave',
            'GET /api/health',
            'GET /api/info'
        ]
    });
});

// Iniciando o servidor
const PORT = config.server.port;
const HOST = config.server.host;

app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor Amazon Scraper rodando em http://${HOST}:${PORT}`);
    console.log(`🔍 API disponível em: http://${HOST}:${PORT}/api/scrape?keyword=sua-palavra-chave`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/api/health`);
    console.log(`📱 Frontend Vite disponível em: http://localhost:5173`);
    console.log(`⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
});

module.exports = app; 