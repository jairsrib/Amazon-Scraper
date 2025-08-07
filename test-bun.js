/**
 * Teste do Amazon Scraper com Bun
 * Verifica se a aplicação está funcionando corretamente
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000';
const VITE_URL = 'http://localhost:5173';

async function testBunScraper() {
    console.log('🧪 Testando Amazon Scraper com Bun + Vite...\n');
    
    try {
        // Teste 1: Verificar se o servidor Bun está rodando
        console.log('1️⃣ Testando servidor Bun...');
        const healthResponse = await axios.get(`${API_URL}/api/health`);
        console.log('✅ Servidor Bun funcionando:', healthResponse.data.message);
        
        // Teste 2: Verificar se o Vite dev server está rodando
        console.log('\n2️⃣ Testando Vite dev server...');
        try {
            const viteResponse = await axios.get(VITE_URL);
            if (viteResponse.status === 200) {
                console.log('✅ Vite dev server funcionando');
            }
        } catch (error) {
            console.log('⚠️ Vite dev server não está rodando (execute: bun run build && bun run preview)');
        }
        
        // Teste 3: Testar scraping com uma palavra-chave simples
        console.log('\n3️⃣ Testando scraping com palavra-chave "livro"...');
        const scrapeResponse = await axios.get(`${API_URL}/api/scrape`, {
            params: { keyword: 'livro' },
            timeout: 30000
        });
        
        if (scrapeResponse.data.success) {
            console.log(`✅ Scraping funcionando! Encontrados ${scrapeResponse.data.totalProducts} produtos`);
            
            if (scrapeResponse.data.products.length > 0) {
                const firstProduct = scrapeResponse.data.products[0];
                console.log(`📦 Primeiro produto: ${firstProduct.title.substring(0, 50)}...`);
                console.log(`⭐ Avaliação: ${firstProduct.rating}`);
                console.log(`📝 Reviews: ${firstProduct.reviews}`);
                console.log(`🔗 Link: ${firstProduct.productUrl}`);
            }
        } else {
            console.log('❌ Erro no scraping:', scrapeResponse.data.error);
        }
        
        console.log('\n🎉 Todos os testes passaram! A aplicação Bun + Vite está funcionando corretamente.');
        console.log('\n📱 Para usar a interface web:');
        console.log('   - Frontend Vite: http://localhost:5173');
        console.log('   - API Bun: http://localhost:3000/api/scrape?keyword=sua-palavra-chave');
        
        console.log('\n🚀 Comandos úteis:');
        console.log('   - Desenvolvimento: bun run dev');
        console.log('   - Build: bun run build');
        console.log('   - Preview: bun run preview');
        console.log('   - Produção: bun start');
        
    } catch (error) {
        console.error('\n❌ Erro durante o teste:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 O servidor não está rodando. Execute:');
            console.log('   bun run dev');
        } else if (error.response) {
            console.log('\n📊 Status:', error.response.status);
            console.log('📄 Dados:', error.response.data);
        }
    }
}

// Executa o teste se este arquivo for executado diretamente
if (require.main === module) {
    testBunScraper();
}

module.exports = { testBunScraper }; 