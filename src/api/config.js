/**
 * Configurações do servidor Amazon Scraper
 */

const config = {
    // Configurações do servidor
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    // Configurações da Amazon
    amazon: {
        baseUrl: 'https://www.amazon.com.br',
        searchPath: '/s',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
    },

    // Configurações de scraping
    scraping: {
        maxProducts: 20,
        timeout: 10000,
        retryAttempts: 3,
        delayBetweenRequests: 1000
    },

    // Configurações de CORS
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        credentials: true
    }
};

module.exports = config;
