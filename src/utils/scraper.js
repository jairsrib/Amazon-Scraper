/**
 * Utilitários para scraping da Amazon
 */

const axios = require('axios');
const { JSDOM } = require('jsdom');
const config = require('../api/config');

/**
 * Função para fazer scraping dos produtos da Amazon
 * @param {string} keyword - Palavra-chave para busca
 * @returns {Array} Array com os dados dos produtos
 */
async function scrapeAmazonProducts(keyword) {
    try {
        // URL da busca da Amazon
        const searchUrl = `${config.amazon.baseUrl}${config.amazon.searchPath}?k=${encodeURIComponent(keyword)}`;
        
        // Headers para simular um navegador real
        const headers = {
            'User-Agent': config.amazon.userAgent,
            ...config.amazon.headers
        };

        console.log(`🔍 Fazendo scraping para: ${keyword}`);
        
        // Fazendo a requisição HTTP
        const response = await axios.get(searchUrl, { 
            headers,
            timeout: config.scraping.timeout
        });
        const html = response.data;
        
        // Parseando o HTML com JSDOM
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Seletores para os elementos dos produtos
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
                
                // Extraindo o link do produto
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
                            ? `${config.amazon.baseUrl}${href}`
                            : `${config.amazon.baseUrl}/${href}`;
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
                console.log(`⚠️ Erro ao processar produto ${index + 1}:`, error.message);
            }
        });
        
        console.log(`✅ Encontrados ${products.length} produtos`);
        return products.slice(0, config.scraping.maxProducts);
        
    } catch (error) {
        console.error('❌ Erro durante o scraping:', error.message);
        throw new Error(`Erro ao fazer scraping: ${error.message}`);
    }
}

/**
 * Função para validar palavra-chave
 * @param {string} keyword - Palavra-chave para validar
 * @returns {boolean} Se a palavra-chave é válida
 */
function validateKeyword(keyword) {
    if (!keyword || typeof keyword !== 'string') {
        return false;
    }
    
    const trimmedKeyword = keyword.trim();
    return trimmedKeyword.length >= 2 && trimmedKeyword.length <= 100;
}

/**
 * Função para limpar e formatar dados do produto
 * @param {Object} product - Produto bruto
 * @returns {Object} Produto formatado
 */
function formatProduct(product) {
    return {
        ...product,
        title: product.title || 'Título não disponível',
        rating: product.rating || 'Sem avaliação',
        reviews: product.reviews || '0 avaliações',
        imageUrl: product.imageUrl || 'Imagem não disponível',
        productUrl: product.productUrl || '#'
    };
}

module.exports = {
    scrapeAmazonProducts,
    validateKeyword,
    formatProduct
};
