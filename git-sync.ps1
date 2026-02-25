#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script para sincronizar alteracoes com o GitHub automaticamente
.DESCRIPTION
    Este script adiciona, comita e envia alteracoes para o GitHub de forma automatica
.PARAMETER Message
    Mensagem do commit (opcional, padrao: "Auto update")
.EXAMPLE
    .\git-sync.ps1
    .\git-sync.ps1 -Message "Atualizacao importante"
#>

param(
    [string]$Message = "Auto update - $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
)

Write-Host "[*] Sincronizando com GitHub..." -ForegroundColor Cyan

# Verifica se ha alteracoes
$status = git status --porcelain
if (-not $status) {
    Write-Host "[OK] Nenhuma alteracao para sincronizar" -ForegroundColor Green
    exit 0
}

# Adiciona todas as alteracoes
Write-Host "[+] Adicionando alteracoes..." -ForegroundColor Yellow
git add .

# Faz o commit
Write-Host "[-] Criando commit: $Message" -ForegroundColor Yellow
git commit -m $Message

# Envia para o GitHub
Write-Host "[>] Enviando para GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Sincronizacao concluida com sucesso!" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Erro ao sincronizar. Verifique sua conexao e autenticacao." -ForegroundColor Red
    exit 1
}
