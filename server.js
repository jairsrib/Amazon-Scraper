const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Função para fazer scraping dos produtos da Amazon
 * @param {string} keyword - Palavra-chave para busca
 * @returns {Array} Array com os dados dos produtos
 */
async function scrapeAmazonProducts(keyword) {
    try {
        // URL da busca da Amazon (usando o domínio brasileiro)
        const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
        
        // Headers para simular um navegador real
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };

        console.log(`Fazendo scraping para: ${keyword}`);
        
        // Fazendo a requisição HTTP
        const response = await axios.get(searchUrl, { headers });
        const html = response.data;
        
        // Parseando o HTML com JSDOM
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Seletores para os elementos dos produtos (múltiplos seletores para maior compatibilidade)
        const productCards = document.querySelectorAll('[data-component-type="s-search-result"], .s-result-item, .sg-col-inner');
        
        const products = [];
        
        productCards.forEach((card, index) => {
            try {
                // Extraindo o título do produto
                const titleElement = card.querySelector('h2 a span') || card.querySelector('.a-text-normal');
                const title = titleElement ? titleElement.textContent.trim() : 'Título não disponível';
                
                // Extraindo a avaliação (estrelas)
                const ratingElement = card.querySelector('.a-icon-alt');
                let rating = 'Sem avaliação';
                if (ratingElement) {
                    const ratingText = ratingElement.textContent.trim();
                    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
                    if (ratingMatch) {
                        rating = `${ratingMatch[1]} de 5 estrelas`;
                    }
                }
                
                // Extraindo o número de avaliações
                const reviewsElement = card.querySelector('a[href*="customerReviews"] span');
                const reviews = reviewsElement ? reviewsElement.textContent.trim() : '0 avaliações';
                
                // Extraindo a URL da imagem
                const imageElement = card.querySelector('img.s-image');
                const imageUrl = imageElement ? imageElement.src : 'Imagem não disponível';
                
                // Extraindo o link do produto (múltiplos seletores para maior compatibilidade)
                const linkElement = card.querySelector('h2 a, .a-link-normal, a[href*="/dp/"], a[href*="/gp/product/"]');
                let productUrl = '#';
                if (linkElement) {
                    const href = linkElement.href;
                    // Verifica se já é uma URL completa
                    if (href.startsWith('http')) {
                        productUrl = href;
                    } else {
                        // Adiciona o domínio da Amazon se for um caminho relativo
                        productUrl = href.startsWith('/') 
                            ? `https://www.amazon.com.br${href}`
                            : `https://www.amazon.com.br/${href}`;
                    }
                    
                    // Limpa a URL removendo parâmetros desnecessários
                    productUrl = productUrl.split('?')[0];
                }
                
                // Adicionando o produto ao array se tiver pelo menos um título
                if (title && title !== 'Título não disponível') {
                    products.push({
                        id: index + 1,
                        title,
                        rating,
                        reviews,
                        imageUrl,
                        productUrl
                    });
                }
            } catch (error) {
                console.log(`Erro ao processar produto ${index + 1}:`, error.message);
            }
        });
        
        console.log(`Encontrados ${products.length} produtos`);
        return products;
        
    } catch (error) {
        console.error('Erro durante o scraping:', error.message);
        throw new Error(`Erro ao fazer scraping: ${error.message}`);
    }
}

// Endpoint para scraping
app.get('/api/scrape', async (req, res) => {
    try {
        const { keyword } = req.query;
        
        // Validação do parâmetro keyword
        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Parâmetro "keyword" é obrigatório'
            });
        }
        
        console.log(`Iniciando scraping para: "${keyword}"`);
        
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
        console.error('Erro no endpoint /api/scrape:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erro interno do servidor'
        });
    }
});

// Endpoint de teste
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor Bun funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Bun rodando na porta ${PORT}`);
    console.log(`🔍 API disponível em: http://localhost:${PORT}/api/scrape?keyword=sua-palavra-chave`);
    console.log(`📱 Frontend Vite disponível em: http://localhost:5173`);
});

module.exports = app; 