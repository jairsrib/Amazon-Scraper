import './style.css'

/**
 * Amazon Product Scraper - Frontend JavaScript com Vite
 * Gerencia a interface do usuário e comunicação com a API
 */

class AmazonScraper {
    constructor() {
        this.apiUrl = '/api/scrape';
        this.currentKeyword = '';
        this.isLoading = false;
        
        // Elementos do DOM
        this.elements = {
            keywordInput: document.getElementById('keywordInput'),
            searchBtn: document.getElementById('searchBtn'),
            loadingSection: document.getElementById('loadingSection'),
            resultsSection: document.getElementById('resultsSection'),
            errorSection: document.getElementById('errorSection'),
            emptySection: document.getElementById('emptySection'),
            productsGrid: document.getElementById('productsGrid'),
            resultsTitle: document.getElementById('resultsTitle'),
            resultsCount: document.getElementById('resultsCount'),
            errorMessage: document.getElementById('errorMessage'),
            retryBtn: document.getElementById('retryBtn'),
            productModal: document.getElementById('productModal'),
            modalTitle: document.getElementById('modalTitle'),
            modalContent: document.getElementById('modalContent'),
            closeModal: document.getElementById('closeModal')
        };
        
        this.initializeEventListeners();
    }
    
    /**
     * Inicializa os event listeners da aplicação
     */
    initializeEventListeners() {
        // Botão de busca
        this.elements.searchBtn.addEventListener('click', () => {
            this.handleSearch();
        });
        
        // Busca ao pressionar Enter
        this.elements.keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        // Botão de tentar novamente
        this.elements.retryBtn.addEventListener('click', () => {
            this.handleSearch();
        });
        
        // Fechar modal
        this.elements.closeModal.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Fechar modal ao clicar fora
        this.elements.productModal.addEventListener('click', (e) => {
            if (e.target === this.elements.productModal) {
                this.closeModal();
            }
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.elements.productModal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }
    
    /**
     * Gerencia o processo de busca
     */
    async handleSearch() {
        const keyword = this.elements.keywordInput.value.trim();
        
        // Validação do input
        if (!keyword) {
            this.showError('Por favor, digite uma palavra-chave para buscar.');
            return;
        }
        
        // Evita múltiplas requisições simultâneas
        if (this.isLoading) {
            return;
        }
        
        this.currentKeyword = keyword;
        this.isLoading = true;
        
        // Atualiza a interface
        this.showLoading();
        this.disableSearchButton();
        
        try {
            // Faz a requisição para a API
            const response = await this.fetchProducts(keyword);
            
            if (response.success) {
                this.displayResults(response);
            } else {
                this.showError(response.error || 'Erro desconhecido');
            }
            
        } catch (error) {
            console.error('Erro na busca:', error);
            this.showError('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            this.isLoading = false;
            this.enableSearchButton();
        }
    }
    
    /**
     * Faz a requisição para a API
     * @param {string} keyword - Palavra-chave para busca
     * @returns {Promise<Object>} Resposta da API
     */
    async fetchProducts(keyword) {
        const url = `${this.apiUrl}?keyword=${encodeURIComponent(keyword)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    /**
     * Exibe os resultados da busca
     * @param {Object} data - Dados retornados pela API
     */
    displayResults(data) {
        const { products, keyword, totalProducts } = data;
        
        // Atualiza o título e contador
        this.elements.resultsTitle.textContent = `Resultados para "${keyword}"`;
        this.elements.resultsCount.textContent = `${totalProducts} produto${totalProducts !== 1 ? 's' : ''} encontrado${totalProducts !== 1 ? 's' : ''}`;
        
        // Verifica se há produtos
        if (!products || products.length === 0) {
            this.showEmptyResults();
            return;
        }
        
        // Renderiza os produtos
        this.renderProducts(products);
        
        // Mostra a seção de resultados
        this.hideAllSections();
        this.elements.resultsSection.classList.remove('hidden');
    }
    
    /**
     * Renderiza os produtos na grade
     * @param {Array} products - Array de produtos
     */
    renderProducts(products) {
        this.elements.productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            this.elements.productsGrid.appendChild(productCard);
        });
    }
    
    /**
     * Cria um card de produto
     * @param {Object} product - Dados do produto
     * @returns {HTMLElement} Elemento do card
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Gera estrelas baseado na avaliação
        const stars = this.generateStars(product.rating);
        
        card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gbsOjbyBkaXNwb27DrXZlbDwvdGV4dD4KPC9zdmc+';">
            <div class="product-info">
                <h3 class="product-title">${this.escapeHtml(product.title)}</h3>
                <div class="product-rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-text">${product.rating}</span>
                </div>
                <p class="product-reviews">${product.reviews}</p>
                <div class="product-actions">
                    <button class="view-details" onclick="scraper.showProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-info-circle"></i>
                        Ver Detalhes
                    </button>
                    <a href="${product.productUrl}" target="_blank" class="amazon-link" onclick="scraper.trackAmazonClick('${this.escapeHtml(product.title)}')">
                        <i class="fab fa-amazon"></i>
                        Ver na Amazon
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    /**
     * Gera estrelas baseado na avaliação
     * @param {string} rating - Avaliação do produto
     * @returns {string} HTML das estrelas
     */
    generateStars(rating) {
        if (rating === 'Sem avaliação') {
            return '<i class="far fa-star"></i>'.repeat(5);
        }
        
        const ratingMatch = rating.match(/(\d+(?:\.\d+)?)/);
        if (!ratingMatch) {
            return '<i class="far fa-star"></i>'.repeat(5);
        }
        
        const ratingValue = parseFloat(ratingMatch[1]);
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        stars += '<i class="fas fa-star"></i>'.repeat(fullStars);
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        stars += '<i class="far fa-star"></i>'.repeat(emptyStars);
        
        return stars;
    }
    
    /**
     * Mostra o modal com detalhes do produto
     * @param {Object} product - Dados do produto
     */
    showProductModal(product) {
        const stars = this.generateStars(product.rating);
        
        this.elements.modalTitle.textContent = 'Detalhes do Produto';
        this.elements.modalContent.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}" class="modal-product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gbsOjbyBkaXNwb27DrXZlbDwvdGV4dD4KPC9zdmc+';">
            <h3 class="modal-product-title">${this.escapeHtml(product.title)}</h3>
            <div class="modal-product-rating">
                <span class="rating-stars">${stars}</span>
                <span class="rating-text">${product.rating}</span>
            </div>
            <p class="modal-product-reviews">${product.reviews}</p>
            <a href="${product.productUrl}" target="_blank" class="modal-product-link">
                <i class="fas fa-external-link-alt"></i>
                Ver na Amazon
            </a>
        `;
        
        this.elements.productModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Fecha o modal
     */
    closeModal() {
        this.elements.productModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    /**
     * Função para rastrear cliques nos links da Amazon
     * @param {string} productTitle - Título do produto clicado
     */
    trackAmazonClick(productTitle) {
        console.log(`🛒 Usuário clicou no produto: ${productTitle}`);
        // Aqui você pode adicionar analytics ou tracking se necessário
    }
    
    /**
     * Mostra a seção de carregamento
     */
    showLoading() {
        this.hideAllSections();
        this.elements.loadingSection.classList.remove('hidden');
    }
    
    /**
     * Mostra a seção de erro
     * @param {string} message - Mensagem de erro
     */
    showError(message) {
        this.hideAllSections();
        this.elements.errorMessage.textContent = message;
        this.elements.errorSection.classList.remove('hidden');
    }
    
    /**
     * Mostra a seção de resultados vazios
     */
    showEmptyResults() {
        this.hideAllSections();
        this.elements.emptySection.classList.remove('hidden');
    }
    
    /**
     * Esconde todas as seções
     */
    hideAllSections() {
        this.elements.loadingSection.classList.add('hidden');
        this.elements.resultsSection.classList.add('hidden');
        this.elements.errorSection.classList.add('hidden');
        this.elements.emptySection.classList.add('hidden');
    }
    
    /**
     * Desabilita o botão de busca
     */
    disableSearchButton() {
        this.elements.searchBtn.disabled = true;
        this.elements.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    }
    
    /**
     * Habilita o botão de busca
     */
    enableSearchButton() {
        this.elements.searchBtn.disabled = false;
        this.elements.searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar Produtos';
    }
    
    /**
     * Escapa HTML para evitar XSS
     * @param {string} text - Texto para escapar
     * @returns {string} Texto escapado
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.scraper = new AmazonScraper();
    
    // Foca no input de busca
    setTimeout(() => {
        document.getElementById('keywordInput').focus();
    }, 100);
});

// Adiciona funcionalidade de loading global
window.addEventListener('beforeunload', () => {
    document.body.style.cursor = 'wait';
});

// Remove loading global
window.addEventListener('load', () => {
    document.body.style.cursor = 'default';
}); 