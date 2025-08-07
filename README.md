# Amazon Product Scraper 🛒 (Bun + Vite)

Uma aplicação web moderna para fazer scraping de produtos da Amazon usando **Bun** como runtime e **Vite** como bundler, extraindo informações como título, avaliações, número de reviews e imagens dos produtos.

## ✨ Funcionalidades

- 🔍 **Busca por palavra-chave**: Digite qualquer produto para buscar na Amazon
- 📊 **Extração de dados**: Título, avaliação, número de reviews e imagem do produto
- 🎨 **Interface moderna**: Design responsivo e intuitivo
- ⚡ **Performance otimizada**: Bun + Vite para máxima velocidade
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🛡️ **Tratamento de erros**: Mensagens claras e opção de retry
- 🔗 **Links diretos**: Acesso direto aos produtos na Amazon

## 🛠️ Tecnologias Utilizadas

### Backend
- **Bun** - Runtime JavaScript ultra-rápido
- **Express.js** - Framework web
- **Axios** - Cliente HTTP para requisições
- **JSDOM** - Parser HTML para extração de dados
- **CORS** - Middleware para Cross-Origin Resource Sharing

### Frontend
- **Vite** - Bundler e dev server ultra-rápido
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com gradientes e animações
- **JavaScript ES6+** - Funcionalidades interativas
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Inter)

## 📋 Pré-requisitos

- **Bun** (versão 1.0.0 ou superior)
- Conexão com a internet

## 🚀 Instalação e Configuração

### 1. Instalar Bun

```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone ou baixe o projeto
```bash
# Se você tem o Git instalado
git clone <url-do-repositorio>
cd amazon-scraper-bun

# Ou simplesmente navegue para a pasta do projeto
cd amazon-scraper-bun
```

### 3. Instale as dependências
```bash
bun install
```

### 4. Execute a aplicação

#### Opção A: Desenvolvimento (Recomendado)
```bash
# Terminal 1: Iniciar servidor Bun
bun run dev

# Terminal 2: Iniciar Vite dev server
bun run build
bun run preview
```

#### Opção B: Produção
```bash
# Build do frontend
bun run build

# Iniciar servidor
bun start
```

### 5. Acesse a aplicação
- **Frontend Vite**: `http://localhost:5173`
- **API Bun**: `http://localhost:3000`

## 📖 Como Usar

1. **Digite uma palavra-chave**: No campo de busca, digite o nome do produto que deseja encontrar
2. **Clique em "Buscar Produtos"**: Ou pressione Enter para iniciar a busca
3. **Aguarde o carregamento**: A aplicação fará o scraping da primeira página de resultados
4. **Visualize os resultados**: Os produtos aparecerão em cards organizados
5. **Veja os detalhes**: Clique em "Ver Detalhes" para abrir um modal com mais informações
6. **Acesse a Amazon**: Use o link "Ver na Amazon" para ir diretamente ao produto

## 🔧 Estrutura do Projeto

```
amazon-scraper-bun/
├── server.js              # Servidor Express com Bun
├── package.json           # Configurações e dependências
├── vite.config.js         # Configuração do Vite
├── index.html             # Página principal
├── README.md             # Documentação
└── src/                  # Código fonte do frontend
    ├── main.js           # JavaScript principal
    └── style.css         # Estilos CSS
```

## 🌐 Endpoints da API

### GET `/api/scrape`
Faz o scraping dos produtos da Amazon para uma palavra-chave específica.

**Parâmetros:**
- `keyword` (string, obrigatório): Palavra-chave para busca

**Exemplo de uso:**
```
GET /api/scrape?keyword=smartphone
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "keyword": "smartphone",
  "totalProducts": 24,
  "products": [
    {
      "id": 1,
      "title": "Smartphone Samsung Galaxy A54",
      "rating": "4.5 de 5 estrelas",
      "reviews": "1.234 avaliações",
      "imageUrl": "https://m.media-amazon.com/images/I/...",
      "productUrl": "https://www.amazon.com.br/..."
    }
  ]
}
```

### GET `/api/health`
Endpoint de verificação de saúde do servidor.

**Resposta:**
```json
{
  "success": true,
  "message": "Servidor Bun funcionando corretamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## ⚡ Vantagens do Bun + Vite

### Bun
- 🚀 **10x mais rápido** que Node.js
- 📦 **Gerenciador de pacotes integrado**
- 🔥 **Hot reload** nativo
- 🛠️ **Compatível** com Node.js
- ⚡ **Startup instantâneo**

### Vite
- ⚡ **Dev server ultra-rápido**
- 🔥 **Hot Module Replacement (HMR)**
- 📦 **Build otimizado**
- 🛠️ **Configuração simples**
- 🌐 **Proxy automático** para API

## ⚠️ Considerações Importantes

### Limitações
- **Primeira página apenas**: O scraper extrai apenas os resultados da primeira página
- **Rate limiting**: A Amazon pode limitar requisições excessivas
- **Mudanças na estrutura**: Se a Amazon alterar o HTML, o scraper pode parar de funcionar

### Boas Práticas
- Use palavras-chave específicas para melhores resultados
- Não faça muitas requisições em sequência
- Respeite os termos de uso da Amazon
- Use apenas para fins educacionais e de pesquisa

### Troubleshooting

**Erro: "Bun não encontrado"**
```bash
# Reinstalar Bun
curl -fsSL https://bun.sh/install | bash
```

**Erro: "Erro de conexão"**
- Verifique sua conexão com a internet
- Tente novamente em alguns minutos
- A Amazon pode estar bloqueando requisições

**Erro: "Nenhum produto encontrado"**
- Tente palavras-chave diferentes
- Use termos mais específicos
- Verifique se a palavra-chave está correta

## 🔒 Segurança

- **Validação de entrada**: Todos os inputs são validados e escapados
- **CORS configurado**: Permite requisições do frontend
- **Headers seguros**: Simula um navegador real para evitar bloqueios
- **Sanitização HTML**: Previne ataques XSS

## 📝 Licença

Este projeto é apenas para fins educacionais. Respeite os termos de uso da Amazon e use de forma responsável.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novas funcionalidades
- Melhorar a documentação

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:
1. Verifique a seção de troubleshooting
2. Consulte os logs do console
3. Teste com diferentes palavras-chave
4. Verifique se o Bun está instalado corretamente

---

**Desenvolvido com ❤️ usando Bun + Vite para máxima performance** 