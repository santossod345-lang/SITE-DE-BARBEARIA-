# Barbearia Luxo Dubai 💈✨

Sistema completo de agendamento para barbearia de luxo com integração real ao ClientFlow.

## 🎨 Características

- **Design Luxuoso Estilo Dubai**: Interface minimalista em preto (#0B0B0B) e dourado (#C6A75E)
- **Sistema de Agendamento Completo**: Escolha barbeiro, serviço, data e horário
- **Integração Real com ClientFlow**: Envia eventos automáticos via API
- **Lista de Espera Automática**: Notificação quando houver cancelamento
- **Lembretes Automáticos**: 24h e 2h antes do agendamento
- **Sistema de Avaliações**: Com aprovação antes de publicar
- **Arquitetura Escalável**: Código limpo e desacoplado

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion** (animações)

### Backend
- **Node.js**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** (validação)
- **Axios** (integração HTTP)

### Ferramentas
- **node-cron** (tarefas agendadas)
- **nanoid** (geração de tokens)

## 📁 Estrutura do Projeto

```
barbearia-luxo-dubai/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.js                # Dados iniciais
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── appointments/
│   │   │   ├── barbers/
│   │   │   ├── services/
│   │   │   ├── reviews/
│   │   │   ├── waitlist/
│   │   │   └── clientflow/
│   │   ├── agendar/          # Página de agendamento
│   │   ├── avaliacoes/       # Página de avaliações
│   │   ├── review/           # Página para avaliar
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── prisma.ts         # Cliente Prisma
│   │   └── api-utils.ts      # Utilidades de API
│   ├── services/
│   │   ├── appointment.service.ts
│   │   ├── clientflow.service.ts
│   │   ├── waitlist.service.ts
│   │   └── review.service.ts
│   └── workers/
│       └── integration-worker.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example
```

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

```powershell
npm install
```

### 2. Configurar Banco de Dados

Copie o arquivo `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/barbearia_luxo"
CLIENTFLOW_API_URL="https://api.clientflow.com"
CLIENTFLOW_API_KEY="sua-api-key-aqui"
API_SECRET_KEY="sua-secret-key-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Criar o Banco de Dados

```powershell
npx prisma migrate dev --name init
```

### 4. Popular com Dados Iniciais

```powershell
node prisma/seed.js
```

### 5. Iniciar o Projeto

```powershell
# Terminal 1 - Aplicação Next.js
npm run dev

# Terminal 2 - Worker de Integração
npm run worker
```

Acesse: http://localhost:3000

## 📊 Banco de Dados

### Tabelas Principais

- **barbers**: Barbeiros (Bruno e Paulinho)
- **services**: Serviços oferecidos
- **customers**: Cadastro de clientes
- **appointments**: Agendamentos
- **availability**: Disponibilidade customizada dos barbeiros
- **waitlist**: Lista de espera automática
- **reviews**: Avaliações de clientes
- **reminders**: Lembretes automáticos
- **integration_queue**: Fila de eventos para ClientFlow

## 🔗 Integração com ClientFlow

### Eventos Enviados Automaticamente

1. **appointment_created** - Novo agendamento criado
2. **appointment_canceled** - Agendamento cancelado
3. **appointment_completed** - Agendamento concluído
4. **review_created** - Nova avaliação recebida
5. **waitlist_joined** - Cliente entrou na lista de espera

### Endpoint de Métricas

```http
GET /api/clientflow/metrics
Headers:
  X-API-Key: sua-api-key
```

Retorna:
- Total de agendamentos
- Receita total
- Receita por barbeiro
- Taxa de no-show
- Média de avaliações
- Lista de espera ativa

### Sistema de Retry

- Máximo de 3 tentativas por evento
- Eventos falhados ficam na fila
- Worker processa fila a cada 5 minutos
- Logs detalhados de cada tentativa

## 🎯 Funcionalidades

### Sistema de Agendamento

1. Cliente escolhe o barbeiro
2. Seleciona o serviço desejado
3. Vê horários disponíveis em tempo real
4. Informa dados pessoais
5. Recebe confirmação

### Lista de Espera

- Ao cancelar um agendamento, notifica o primeiro da lista
- Reserva o horário por 30 minutos
- Remove automaticamente se não confirmar
- Recalcula posições automaticamente

### Lembretes Automáticos

- **24h antes**: Lembrete do agendamento
- **2h antes**: Confirmação final
- **Após conclusão**: Link para avaliação

### Sistema de Avaliações

- Nota de 1 a 5 estrelas
- Comentário opcional
- Aprovação manual antes de publicar
- Cálculo de média por barbeiro

## 🎨 Design System

### Cores

```css
--dubai-black: #0B0B0B
--dubai-gold: #C6A75E
--dubai-gold-light: #D4B975
--dubai-gold-dark: #B8964D
```

### Componentes

- `btn-primary`: Botão principal dourado
- `btn-secondary`: Botão secundário com borda
- `card`: Card com efeito luxo
- `input-dubai`: Input estilizado
- `section-title`: Título de seção
- `luxury-divider`: Divisor elegante

## 📱 API Routes

### Barbeiros
```
GET /api/barbers
```

### Serviços
```
GET /api/services
```

### Agendamentos
```
POST /api/appointments/availability
POST /api/appointments
GET /api/appointments
POST /api/appointments/[id]/cancel
POST /api/appointments/[id]/complete
```

### Lista de Espera
```
POST /api/waitlist
```

### Avaliações
```
POST /api/reviews
GET /api/reviews
```

### Métricas (ClientFlow)
```
GET /api/clientflow/metrics
```

## 🔒 Segurança

- Validação de dados com Zod
- Sanitização de inputs
- API Key para métricas
- Rate limiting preparado
- Middleware de autenticação

## 📈 Monitoramento

### Logs do Worker

O worker de integração fornece logs detalhados:

```
🔄 Processing integration queue...
✅ Event sent: appointment_created
📋 Event queued for retry: appointment_canceled
🔔 Processing reminders...
📨 Found 2 reminders to send
✅ Reminder sent: reminder_24h
🧹 Cleaning expired waitlist...
```

## 🎯 Próximos Passos

1. Integrar WhatsApp Business API para lembretes
2. Painel administrativo para gerenciar agendamentos
3. Relatórios de desempenho
4. Sistema de fidelidade
5. Pagamento online
6. Notificações push

## 🤝 Contribuição

Este é um projeto profissional e enterprise-ready. Contribuições são bem-vindas!

## 📄 Licença

Copyright © 2026 Barbearia Luxo Dubai. Todos os direitos reservados.

---

**Desenvolvido com ❤️ e ✨ para oferecer a melhor experiência de agendamento**
