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
                error: 'Parameter "keyword" is required and must be between 2 and 100 characters'
            });
        }
        
        console.log(`🚀 Starting scraping for: "${keyword}"`);
        
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
        console.error('❌ Error in /api/scrape endpoint:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error'
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
        message: 'Amazon Scraper server running correctly',
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
        description: 'API for extracting Amazon products',
        endpoints: {
            '/api/scrape': 'GET - Extract products by keyword',
            '/api/health': 'GET - Server status',
            '/api/info': 'GET - API information'
        },
        config: {
            maxProducts: config.scraping.maxProducts,
            timeout: config.scraping.timeout,
            amazonDomain: config.amazon.baseUrl
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Middleware for routes not found
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
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