@echo off
echo ========================================
echo   Amazon Scraper - Bun + Vite
echo ========================================
echo.

echo Verificando se o Bun esta instalado...
bun --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Bun nao encontrado!
    echo.
    echo Para instalar o Bun, execute:
    echo powershell -c "irm bun.sh/install.ps1 ^| iex"
    echo.
    pause
    exit /b 1
)

echo ✅ Bun encontrado!
echo.

echo Instalando dependencias...
bun install

echo.
echo ========================================
echo   Iniciando a aplicacao...
echo ========================================
echo.
echo 🚀 Servidor Bun: http://localhost:3000
echo 📱 Frontend Vite: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar
echo.

bun run dev 