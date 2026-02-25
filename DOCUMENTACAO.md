# 📖 ÍNDICE DA DOCUMENTAÇÃO

Bem-vindo ao sistema **Barbearia Luxo Dubai**! 

Este é um sistema **enterprise-grade** completo para gestão de barbearia com integração real ao ClientFlow.

---

## 📚 DOCUMENTAÇÃO DISPONÍVEL

### 1. [README.md](README.md) - COMEÇE AQUI! ⭐
Visão geral completa do projeto, tecnologias, estrutura e funcionalidades.

**Você lerá sobre:**
- Características do sistema
- Stack tecnológica
- Estrutura de pastas
- Funcionalidades principais

---

### 2. [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - INSTALAÇÃO 🚀
Guia passo a passo para colocar o sistema funcionando.

**Você aprenderá:**
- Como instalar PostgreSQL
- Como configurar o projeto
- Como inicializar o banco
- Como rodar o sistema
- Como testar as funcionalidades

---

### 3. [ARQUITETURA.md](ARQUITETURA.md) - DESIGN DO SISTEMA 🏗️
Documentação técnica da arquitetura do sistema.

**Você entenderá:**
- Camadas do sistema
- Fluxos de dados
- Modelo de banco de dados
- Estratégias de escalabilidade
- Segurança implementada

---

### 4. [API_DOCS.md](API_DOCS.md) - REFERÊNCIA DA API 📡
Documentação completa de todos os endpoints.

**Você encontrará:**
- Todos os endpoints disponíveis
- Request/Response de cada rota
- Códigos de status
- Exemplos de uso
- Autenticação e segurança

---

### 5. [INTEGRACAO_CLIENTFLOW.md](INTEGRACAO_CLIENTFLOW.md) - INTEGRAÇÃO EXTERNA 🔗
Guia completo da integração com ClientFlow.

**Você aprenderá:**
- Eventos enviados automaticamente
- Sistema de retry e fila
- Webhooks recebidos
- Endpoint de métricas
- Testes de integração

---

## 🎯 INÍCIO RÁPIDO (5 MINUTOS)

### Passo 1: Instalar Dependências
```powershell
npm install
```

### Passo 2: Configurar Banco
```powershell
# Edite o arquivo .env com suas credenciais PostgreSQL
npx prisma migrate dev --name init
node prisma/seed.js
```

### Passo 3: Iniciar Sistema
```powershell
# Terminal 1
npm run dev

# Terminal 2
npm run worker
```

### Passo 4: Acessar
```
http://localhost:3000
```

---

## 📁 ARQUIVOS IMPORTANTES

### Configuração
- `.env` - Variáveis de ambiente
- `.env.example` - Template de configuração
- `package.json` - Dependências
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tema Dubai

### Banco de Dados
- `prisma/schema.prisma` - Schema do banco
- `prisma/seed.js` - Dados iniciais

### Código Fonte
- `src/app/` - Frontend Next.js
- `src/services/` - Lógica de negócio
- `src/lib/` - Utilitários
- `src/workers/` - Jobs em background

### Scripts
- `deploy.ps1` - Script de deploy automático

---

## 🎨 FEATURES IMPLEMENTADAS

### ✅ Funcionalidades Principais
- [x] Sistema de agendamento completo
- [x] Dois barbeiros (Bruno e Paulinho)
- [x] Catálogo de serviços
- [x] Verificação de disponibilidade em tempo real
- [x] Cadastro automático de clientes

### ✅ Lista de Espera
- [x] Entrada automática na fila
- [x] Notificação ao cancelamento
- [x] Reserva temporária (30 min)
- [x] Limpeza automática de expirados

### ✅ Lembretes Automáticos
- [x] Lembrete 24h antes
- [x] Lembrete 2h antes
- [x] Solicitação de avaliação após serviço
- [x] Worker com node-cron

### ✅ Sistema de Avaliações
- [x] Rating de 1 a 5 estrelas
- [x] Comentários opcionais
- [x] Aprovação manual
- [x] Exibição pública apenas aprovadas

### ✅ Integração ClientFlow
- [x] Envio automático de eventos
- [x] Sistema de retry (3 tentativas)
- [x] Fila de integração
- [x] Worker de processamento
- [x] Endpoint de métricas
- [x] Webhook receiver

### ✅ Design Luxo Dubai
- [x] Paleta preto/dourado (#0B0B0B / #C6A75E)
- [x] Animações com Framer Motion
- [x] Interface minimalista
- [x] Responsivo mobile-first
- [x] Experiência premium

### ✅ Segurança
- [x] Validação com Zod
- [x] API Key para endpoints protegidos
- [x] Rate limiting
- [x] Prisma prepared statements
- [x] Environment variables

---

## 🛠️ COMANDOS ÚTEIS

### Desenvolvimento
```powershell
npm run dev          # Inicia Next.js dev
npm run worker       # Inicia worker
npx prisma studio    # Interface visual do banco
```

### Produção
```powershell
npm run build        # Build otimizado
npm start            # Servidor de produção
.\deploy.ps1         # Deploy automatizado
```

### Banco de Dados
```powershell
npx prisma migrate dev       # Criar migration
npx prisma migrate deploy    # Aplicar migrations
npx prisma migrate reset     # Resetar banco
npx prisma generate          # Gerar client
node prisma/seed.js          # Popular dados
```

---

## 🌐 ESTRUTURA DE ROTAS

### Frontend
- `/` - Página inicial
- `/agendar` - Sistema de agendamento
- `/avaliacoes` - Avaliações públicas
- `/review?appointment={id}&token={token}` - Formulário de avaliação

### API
- `/api/barbers` - Barbeiros
- `/api/services` - Serviços
- `/api/appointments` - Agendamentos
- `/api/waitlist` - Lista de espera
- `/api/reviews` - Avaliações
- `/api/clientflow/metrics` - Métricas (protegido)
- `/api/webhooks/clientflow` - Webhook (protegido)

---

## 📊 DADOS DE TESTE

Ao executar `node prisma/seed.js`, são criados:

### Barbeiros
- **Bruno** - 09:00 às 18:00
- **Paulinho** - 10:00 às 19:00

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

## 🔧 TECNOLOGIAS UTILIZADAS

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Framer Motion

### Backend
- Node.js
- Prisma ORM
- PostgreSQL
- Zod (validação)
- node-cron (jobs)

### Integrações
- Axios (HTTP client)
- ClientFlow API

---

## 📞 SUPORTE E TROUBLESHOOTING

### Problemas Comuns

**1. Erro de conexão com banco**
```powershell
# Verifique se PostgreSQL está rodando
psql -U postgres -d barbearia_luxo

# Confirme DATABASE_URL no .env
```

**2. Worker não está processando**
```powershell
# Certifique-se que está rodando
npm run worker

# Verifique logs no terminal
```

**3. Eventos não chegam no ClientFlow**
```powershell
# Verifique as variáveis de ambiente
# Os eventos ficam na fila e serão reenviados
npx prisma studio  # Ver tabela integration_queue
```

---

## 🚀 PRÓXIMOS PASSOS

### Para Produção
1. Configure um banco PostgreSQL em produção
2. Atualize variáveis de ambiente
3. Configure domínio e SSL
4. Execute deploy com `.\deploy.ps1`
5. Configure webhook no ClientFlow

### Melhorias Futuras
- [ ] Painel administrativo
- [ ] WhatsApp Business API
- [ ] Pagamento online
- [ ] Sistema de fidelidade
- [ ] Relatórios avançados
- [ ] App mobile

---

## 📄 LICENÇA

Copyright © 2026 Barbearia Luxo Dubai. Todos os direitos reservados.

---

## 👨‍💻 DESENVOLVEDOR

Sistema desenvolvido com foco em:
- **Qualidade**: Código limpo e organizado
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Segurança**: Proteção de dados e validações
- **Performance**: Otimizações e boas práticas
- **Manutenibilidade**: Documentação completa

---

**🎉 Obrigado por usar a Barbearia Luxo Dubai!**

Para começar, leia o [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

**Desenvolvido com ❤️ e ✨**
