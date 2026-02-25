# 🔄 Sincronização Automática com GitHub

Este projeto está configurado para sincronizar automaticamente com o GitHub!

## 🎯 Duas formas de uso:

### 1️⃣ **Forma Automática** (Recomendada)

Após fazer qualquer alteração, basta fazer o commit normalmente:

```powershell
git add .
git commit -m "Sua mensagem aqui"
```

✨ **O push para o GitHub será feito automaticamente!**

---

### 2️⃣ **Script Rápido** (Ainda mais fácil)

Para sincronizar tudo de uma vez, execute:

```powershell
.\git-sync.ps1
```

Ou com mensagem personalizada:

```powershell
.\git-sync.ps1 -Message "Implementei nova funcionalidade"
```

---

## 📝 Exemplos práticos:

```powershell
# Método 1: Commit manual + push automático
git add .
git commit -m "Adicionei página de login"
# ✅ Push automático acontece

# Método 2: Script completo
.\git-sync.ps1 -Message "Adicionei página de login"
# ✅ Faz add, commit e push automaticamente
```

---

## ⚙️ Configuração

O push automático está configurado através de:
- **Git Hook**: `.git/hooks/post-commit` (executa após cada commit)
- **Script Helper**: `git-sync.ps1` (facilita o processo completo)

---

## 🔍 Verificar status

Para ver o que foi alterado:

```powershell
git status
```

Para ver o histórico:

```powershell
git log --oneline
```

---

## 🌐 Seu repositório

**URL**: https://github.com/santossod345-lang/SITE-DE-BARBEARIA-

🎉 Agora suas alterações sempre estarão sincronizadas com o GitHub!
