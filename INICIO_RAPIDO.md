# 🚀 GUIA DE INÍCIO RÁPIDO

## Passo 1: Instalar PostgreSQL

Baixe e instale o PostgreSQL: https://www.postgresql.org/download/windows/

Durante a instalação, anote a senha do usuário `postgres`.

## Passo 2: Criar o Banco de Dados

Abra o PowerShell e execute:

```powershell
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco
CREATE DATABASE barbearia_luxo;

# Sair
\q
```

## Passo 3: Configurar o Projeto

```powershell
# Navegar para a pasta do projeto
cd "c:\Users\Sueli\Desktop\BRUNO"

# Instalar dependências
npm install

# Configurar o arquivo .env
# Edite o arquivo .env e atualize a senha do PostgreSQL se necessário:
# DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/barbearia_luxo"
```

## Passo 4: Inicializar o Banco

```powershell
# Criar as tabelas
npx prisma migrate dev --name init

# Gerar o Prisma Client
npx prisma generate

# Popular com dados de exemplo
node prisma/seed.js
```

## Passo 5: Iniciar o Sistema

Abra **DOIS** terminais PowerShell:

**Terminal 1 - Aplicação Web:**
```powershell
npm run dev
```

**Terminal 2 - Worker de Integração:**
```powershell
npm run worker
```

## Passo 6: Acessar o Sistema

Abra o navegador em: **http://localhost:3000**

---

## 🎯 Dados de Teste Criados

### Barbeiros
- **Bruno** - Horário: 09:00 às 18:00
- **Paulinho** - Horário: 10:00 às 19:00

### Serviços
- Corte Tradicional - R$ 80,00 (45 min)
- Corte Premium - R$ 120,00 (60 min)
- Barba Completa - R$ 70,00 (40 min)
- Combo Luxo - R$ 180,00 (90 min)

### Clientes
- João Silva - +55 11 99999-1111
- Carlos Santos - +55 11 99999-2222
- Pedro Oliveira - +55 11 99999-3333

---

## 📱 Como Testar

### 1. Fazer um Agendamento
1. Acesse http://localhost:3000/agendar
2. Escolha um barbeiro
3. Selecione um serviço
4. Escolha data e horário
5. Preencha seus dados
6. Confirme

### 2. Ver Avaliações
1. Acesse http://localhost:3000/avaliacoes
2. Veja as avaliações já existentes

### 3. Fazer uma Avaliação
1. Acesse http://localhost:3000/review?appointment=ID&token=TOKEN
2. Dê uma nota de 1 a 5 estrelas
3. Deixe um comentário (opcional)
4. Envie

### 4. Testar API do ClientFlow
```powershell
# Métricas (requer API Key)
curl -H "X-API-Key: super-secret-key-change-this-in-production" http://localhost:3000/api/clientflow/metrics
```

---

## 🔧 Comandos Úteis

```powershell
# Ver banco de dados visual
npx prisma studio

# Resetar banco de dados
npx prisma migrate reset

# Ver logs do Prisma
$env:DEBUG="prisma:*"; npm run dev

# Build para produção
npm run build
npm start
```

---

## 🐛 Solução de Problemas

### Erro: "Can't reach database server"
- Verifique se o PostgreSQL está rodando
- Confirme a senha no arquivo .env
- Teste a conexão: `psql -U postgres -d barbearia_luxo`

### Erro: "Module not found"
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Worker não está rodando
- Certifique-se de ter dois terminais abertos
- Verifique se o arquivo integration-worker.js existe
- Veja os logs do worker para erros

### ClientFlow não recebe eventos
- Verifique CLIENTFLOW_API_URL e CLIENTFLOW_API_KEY no .env
- Os eventos ficam na fila (integration_queue) e serão reenviados
- Use `npx prisma studio` para ver a tabela integration_queue

---

## 📞 Suporte

Para dúvidas ou problemas, revise:
1. README.md - Documentação completa
2. Logs do terminal
3. Prisma Studio - Estado do banco

---

**Desenvolvido com foco em qualidade e escalabilidade** 🚀
