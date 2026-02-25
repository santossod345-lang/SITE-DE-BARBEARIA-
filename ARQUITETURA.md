# 🏗️ ARQUITETURA DO SISTEMA

## 📐 Visão Geral

Este sistema segue uma arquitetura **desacoplada, escalável e de nível enterprise**.

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 14)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Home    │  │ Agendar  │  │Avaliações│          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ API Routes
                      ▼
┌─────────────────────────────────────────────────────┐
│              API LAYER (Next.js API Routes)         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │Appointments│ │ Reviews  │  │ Waitlist │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ Services
                      ▼
┌─────────────────────────────────────────────────────┐
│                  SERVICE LAYER                       │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Appointment  │  │  ClientFlow   │                │
│  │   Service    │  │   Service     │                │
│  └──────────────┘  └──────────────┘                │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Waitlist   │  │    Review     │                │
│  │   Service    │  │   Service     │                │
│  └──────────────┘  └──────────────┘                │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ Prisma ORM
                      ▼
┌─────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                   │
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Barbers │ │Services │ │Customers│               │
│  └─────────┘ └─────────┘ └─────────┘               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │Appoints │ │ Reviews │ │Waitlist │               │
│  └─────────┘ └─────────┘ └─────────┘               │
│  ┌─────────┐ ┌─────────┐                           │
│  │Reminders│ │IntQueue │                           │
│  └─────────┘ └─────────┘                           │
└─────────────────────────────────────────────────────┘

         ┌─────────────────────────────┐
         │  WORKER (Background Jobs)    │
         │  - Integration Queue         │
         │  - Reminders                 │
         │  - Waitlist Cleanup          │
         └─────────────────────────────┘
                     │
                     │ HTTP
                     ▼
         ┌─────────────────────────────┐
         │   CLIENTFLOW API (External)  │
         │   - Receive Events           │
         │   - Metrics                  │
         └─────────────────────────────┘
```

## 🎯 CAMADAS DO SISTEMA

### 1. **Frontend Layer** (Presentation)
- **Tecnologia**: Next.js 14 App Router, React 18
- **Responsabilidade**: Interface do usuário
- **Componentes**:
  - Páginas (Home, Agendar, Avaliações)
  - Componentes reutilizáveis
  - Gerenciamento de estado local

### 2. **API Layer** (Controller)
- **Tecnologia**: Next.js API Routes
- **Responsabilidade**: Endpoints HTTP, validação, autenticação
- **Endpoints**:
  - `/api/appointments` - CRUD de agendamentos
  - `/api/reviews` - Sistema de avaliações
  - `/api/waitlist` - Lista de espera
  - `/api/clientflow/metrics` - Métricas
  - `/api/webhooks/clientflow` - Receber eventos

### 3. **Service Layer** (Business Logic)
- **Tecnologia**: TypeScript classes
- **Responsabilidade**: Lógica de negócio, regras de domínio
- **Services**:
  - `AppointmentService` - Agendamentos
  - `WaitlistService` - Lista de espera
  - `ReviewService` - Avaliações
  - `ClientFlowService` - Integração externa

### 4. **Data Layer** (Repository)
- **Tecnologia**: Prisma ORM
- **Responsabilidade**: Acesso ao banco de dados
- **Features**:
  - Type-safe queries
  - Migrations automáticas
  - Relacionamentos gerenciados

### 5. **Background Jobs Layer** (Worker)
- **Tecnologia**: Node.js + node-cron
- **Responsabilidade**: Tarefas assíncronas
- **Jobs**:
  - Processar fila de integração
  - Enviar lembretes
  - Limpar lista de espera expirada

## 🔄 FLUXOS PRINCIPAIS

### Fluxo de Agendamento
```
1. Cliente acessa /agendar
2. Escolhe barbeiro → GET /api/barbers
3. Escolhe serviço → GET /api/services
4. Escolhe data/hora → POST /api/appointments/availability
5. Preenche dados → POST /api/appointments
6. AppointmentService.createAppointment()
   ├─ Valida disponibilidade
   ├─ Cria/busca cliente
   ├─ Cria agendamento
   ├─ Cria lembretes
   └─ ClientFlowService.appointmentCreated()
7. Retorna confirmação
```

### Fluxo de Cancelamento
```
1. Admin cancela → POST /api/appointments/[id]/cancel
2. AppointmentService.cancelAppointment()
3. ClientFlowService.appointmentCanceled()
4. WaitlistService.notifyNext()
   ├─ Busca próximo da fila
   ├─ Notifica cliente
   └─ Reserva horário por 30min
5. Retorna confirmação
```

### Fluxo de Integração
```
1. Evento ocorre (ex: agendamento criado)
2. ClientFlowService.sendEvent()
   ├─ Tenta enviar HTTP POST
   ├─ Se sucesso → log
   └─ Se falha → IntegrationQueue.create()
3. Worker (a cada 5min)
   ├─ Busca eventos pendentes
   ├─ Retry (max 3x)
   └─ Move para 'sent' ou 'failed'
```

## 🗄️ MODELO DE DADOS

### Entidades Principais

**Barber** (Barbeiros)
- Lista os profissionais
- Horários padrão e customizados
- Relacionamento: 1:N com Appointments

**Service** (Serviços)
- Catálogo de serviços
- Preço e duração
- Relacionamento: 1:N com Appointments

**Customer** (Clientes)
- Cadastro único por telefone
- Relacionamento: 1:N com Appointments

**Appointment** (Agendamentos)
- Core do sistema
- Status: pending, confirmed, canceled, completed, no_show
- Relacionamentos: N:1 com Barber, Service, Customer

**Waitlist** (Lista de Espera)
- Fila automática por barbeiro/data
- Sistema de posições
- Notificação e expiração

**Review** (Avaliações)
- Rating 1-5
- Aprovação manual
- Token único para segurança

**Reminder** (Lembretes)
- Tipos: 24h, 2h, review
- Status: pending, sent, failed
- Agendados automaticamente

**IntegrationQueue** (Fila de Integração)
- Eventos pendentes/falhados
- Sistema de retry
- Logs de tentativas

## 🔐 SEGURANÇA

### Níveis de Segurança

1. **Input Validation** - Zod schemas
2. **SQL Injection** - Prisma prepared statements
3. **API Key** - Endpoints protegidos
4. **Rate Limiting** - Preparado (a implementar)
5. **CORS** - Configurável
6. **Environment Variables** - Secrets protegidos

## 📈 ESCALABILIDADE

### Estratégias Implementadas

1. **Stateless API** - Sem sessões em memória
2. **Connection Pooling** - Prisma gerencia pool
3. **Background Jobs** - Worker separado
4. **Queue System** - Fila de integração
5. **Indexes** - Otimizações no banco

### Próximas Melhorias

1. **Redis Cache** - Cache de disponibilidade
2. **Load Balancer** - Múltiplas instâncias
3. **CDN** - Assets estáticos
4. **Database Replication** - Read replicas
5. **Message Queue** - RabbitMQ/SQS

## 🧪 TESTABILIDADE

### Preparado para Testes

```typescript
// Service isolado
describe('AppointmentService', () => {
  it('should create appointment', async () => {
    // Test implementation
  });
});

// API Route
describe('POST /api/appointments', () => {
  it('should return 201 on success', async () => {
    // Test implementation
  });
});
```

## 📊 MONITORAMENTO

### Logs Estruturados

```typescript
console.log('✅ Event sent:', eventType);
console.error('❌ Integration failed:', error);
console.info('📊 Processing queue:', count);
```

### Métricas Disponíveis

Via `/api/clientflow/metrics`:
- Total de agendamentos
- Receita por barbeiro
- Taxa de no-show
- Média de avaliações

## 🚀 DEPLOYMENT

### Ambientes

1. **Development** - `npm run dev`
2. **Production** - `npm run build && npm start`
3. **Worker** - `npm run worker`

### Checklist de Deploy

- [ ] Configurar variáveis de ambiente
- [ ] Criar banco PostgreSQL
- [ ] Executar migrations
- [ ] Executar seed (opcional)
- [ ] Build do Next.js
- [ ] Iniciar aplicação
- [ ] Iniciar worker

---

**Arquitetura sólida, escalável e pronta para crescimento** 🚀
