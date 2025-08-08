/**
 * Amazon Product Scraper - Servidor Principal
 * 
 * Este arquivo inicia o servidor Express para a API de scraping da Amazon.
 * Utiliza Bun como runtime para máxima performance.
 */

// Importando o servidor configurado
const app = require('./src/api/server');

// O servidor já está configurado e iniciado no arquivo src/api/server.js
// Este arquivo serve como ponto de entrada principal

console.log('🎯 Amazon Product Scraper iniciado com sucesso!');
console.log('📚 Para mais informações, consulte o README.md');
