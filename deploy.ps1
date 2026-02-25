# Script de Deploy para Produção

Write-Host "🚀 Iniciando deploy da Barbearia Luxo Dubai..." -ForegroundColor Cyan

# 1. Verificar Node.js
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado. Instale: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 2. Verificar PostgreSQL
Write-Host "`n🐘 Verificando PostgreSQL..." -ForegroundColor Yellow
psql --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ PostgreSQL não encontrado. Instale: https://www.postgresql.org/download/" -ForegroundColor Red
    exit 1
}

# 3. Verificar arquivo .env
Write-Host "`n🔐 Verificando configurações..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado." -ForegroundColor Red
    Write-Host "   Copie .env.example para .env e configure as variáveis." -ForegroundColor Yellow
    exit 1
}

# 4. Instalar dependências
Write-Host "`n📚 Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

# 5. Gerar Prisma Client
Write-Host "`n🔨 Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao gerar Prisma Client" -ForegroundColor Red
    exit 1
}

# 6. Aplicar migrações
Write-Host "`n🗄️  Aplicando migrações do banco..." -ForegroundColor Yellow
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao aplicar migrações" -ForegroundColor Red
    exit 1
}

# 7. Popular banco (opcional - apenas em primeira instalação)
$seed = Read-Host "`n🌱 Deseja popular o banco com dados iniciais? (S/N)"
if ($seed -eq "S" -or $seed -eq "s") {
    Write-Host "   Populando banco de dados..." -ForegroundColor Yellow
    node prisma/seed.js
}

# 8. Build do Next.js
Write-Host "`n🏗️  Fazendo build do Next.js..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer build" -ForegroundColor Red
    exit 1
}

# 9. Teste rápido
Write-Host "`n🧪 Testando conexão com banco..." -ForegroundColor Yellow
npx prisma db push --skip-generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na conexão com banco de dados" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "`nPara iniciar o sistema:" -ForegroundColor Cyan
Write-Host "  Terminal 1: npm start" -ForegroundColor White
Write-Host "  Terminal 2: npm run worker" -ForegroundColor White
Write-Host "`nAcesse: http://localhost:3000" -ForegroundColor Cyan
