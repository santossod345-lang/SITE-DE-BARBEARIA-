# 📚 DOCUMENTAÇÃO COMPLETA DA API

## Base URL
```
http://localhost:3000/api
```

---

## 🧑‍💼 BARBEIROS

### Listar Barbeiros
Retorna todos os barbeiros ativos.

**Endpoint:** `GET /barbers`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Bruno",
    "description": "Especialista em cortes modernos",
    "imageUrl": null,
    "defaultStartTime": "09:00",
    "defaultEndTime": "18:00",
    "isActive": true,
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T10:00:00Z"
  }
]
```

**Status Codes:**
- `200` - Sucesso
- `500` - Erro interno

---

## 💈 SERVIÇOS

### Listar Serviços
Retorna todos os serviços ativos.

**Endpoint:** `GET /services`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Corte Premium",
    "description": "Corte moderno com técnicas avançadas",
    "duration": 60,
    "price": "120.00",
    "isActive": true,
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T10:00:00Z"
  }
]
```

**Status Codes:**
- `200` - Sucesso
- `500` - Erro interno

---

## 📅 AGENDAMENTOS

### Verificar Disponibilidade
Retorna horários disponíveis para um barbeiro e serviço em uma data.

**Endpoint:** `POST /appointments/availability`

**Request Body:**
```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "date": "2026-02-25"
}
```

**Response:**
```json
{
  "slots": [
    { "time": "09:00", "available": true },
    { "time": "09:30", "available": false },
    { "time": "10:00", "available": true }
  ]
}
```

**Status Codes:**
- `200` - Sucesso
- `400` - Dados inválidos
- `500` - Erro interno

---

### Criar Agendamento
Cria um novo agendamento.

**Endpoint:** `POST /appointments`

**Request Body:**
```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "customerName": "João Silva",
  "customerPhone": "+55 11 99999-1111",
  "date": "2026-02-25",
  "time": "10:00",
  "notes": "Preferência por degradê" // opcional
}
```

**Response:**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid",
    "barber": "Bruno",
    "service": "Corte Premium",
    "date": "2026-02-25T00:00:00Z",
    "time": "10:00",
    "status": "confirmed"
  }
}
```

**Status Codes:**
- `201` - Criado com sucesso
- `400` - Dados inválidos ou horário indisponível
- `500` - Erro interno

**Eventos Disparados:**
- `appointment_created` → ClientFlow

---

### Listar Agendamentos
Retorna os últimos 50 agendamentos.

**Endpoint:** `GET /appointments`

**Response:**
```json
[
  {
    "id": "uuid",
    "date": "2026-02-25T00:00:00Z",
    "time": "10:00",
    "status": "confirmed",
    "notes": null,
    "barber": {
      "id": "uuid",
      "name": "Bruno"
    },
    "service": {
      "id": "uuid",
      "name": "Corte Premium",
      "price": "120.00"
    },
    "customer": {
      "id": "uuid",
      "name": "João Silva",
      "phone": "+55 11 99999-1111"
    }
  }
]
```

**Status Codes:**
- `200` - Sucesso
- `500` - Erro interno

---

### Cancelar Agendamento
Cancela um agendamento e notifica lista de espera.

**Endpoint:** `POST /appointments/{id}/cancel`

**Response:**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid",
    "status": "canceled"
  },
  "waitlistNotification": {
    "customer": {
      "name": "Carlos Santos",
      "phone": "+55 11 99999-2222"
    },
    "time": "10:00",
    "expiresAt": "2026-02-25T10:30:00Z"
  }
}
```

**Status Codes:**
- `200` - Sucesso
- `400` - Erro ao cancelar
- `404` - Agendamento não encontrado

**Eventos Disparados:**
- `appointment_canceled` → ClientFlow

---

### Completar Agendamento
Marca agendamento como concluído e gera link de avaliação.

**Endpoint:** `POST /appointments/{id}/complete`

**Response:**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid",
    "status": "completed"
  },
  "reviewUrl": "http://localhost:3000/review/{token}?appointment={id}"
}
```

**Status Codes:**
- `200` - Sucesso
- `400` - Erro ao completar
- `404` - Agendamento não encontrado

**Eventos Disparados:**
- `appointment_completed` → ClientFlow

---

## 🕐 LISTA DE ESPERA

### Entrar na Lista de Espera
Adiciona cliente à lista de espera para um barbeiro/data.

**Endpoint:** `POST /waitlist`

**Request Body:**
```json
{
  "barberId": "uuid",
  "serviceId": "uuid",
  "customerName": "Pedro Oliveira",
  "customerPhone": "+55 11 99999-3333",
  "date": "2026-02-25"
}
```

**Response:**
```json
{
  "success": true,
  "position": 3,
  "waitlistId": "uuid"
}
```

**Status Codes:**
- `201` - Adicionado com sucesso
- `400` - Dados inválidos
- `500` - Erro interno

**Eventos Disparados:**
- `waitlist_joined` → ClientFlow

---

## ⭐ AVALIAÇÕES

### Criar Avaliação
Cria uma nova avaliação para um agendamento.

**Endpoint:** `POST /reviews`

**Request Body:**
```json
{
  "appointmentId": "uuid",
  "token": "token-gerado",
  "rating": 5,
  "comment": "Excelente atendimento!" // opcional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Avaliação enviada! Aguardando aprovação."
}
```

**Status Codes:**
- `201` - Criado com sucesso
- `400` - Dados inválidos ou token incorreto
- `500` - Erro interno

**Eventos Disparados:**
- `review_created` → ClientFlow

**Validações:**
- Rating deve ser entre 1 e 5
- Agendamento deve estar "completed"
- Não pode avaliar duas vezes

---

### Listar Avaliações
Retorna as últimas 20 avaliações aprovadas.

**Endpoint:** `GET /reviews`

**Response:**
```json
[
  {
    "id": "uuid",
    "rating": 5,
    "comment": "Excelente atendimento!",
    "approved": true,
    "createdAt": "2026-02-25T15:00:00Z",
    "appointment": {
      "barber": {
        "name": "Bruno"
      },
      "customer": {
        "name": "João Silva"
      }
    }
  }
]
```

**Status Codes:**
- `200` - Sucesso
- `500` - Erro interno

---

## 📊 MÉTRICAS (ClientFlow)

### Obter Métricas
Retorna métricas completas do sistema.

**Endpoint:** `GET /clientflow/metrics`

**Headers:**
```
X-API-Key: {API_SECRET_KEY}
```

**Response:**
```json
{
  "total_appointments": 150,
  "revenue_total": 18500.00,
  "revenue_by_barber": [
    {
      "barberId": "uuid",
      "barberName": "Bruno",
      "revenue": 9800.00,
      "appointmentsCount": 82
    }
  ],
  "no_show_rate": 3.5,
  "average_rating": 4.8,
  "active_waitlist": 12,
  "generated_at": "2026-02-25T16:00:00Z"
}
```

**Status Codes:**
- `200` - Sucesso
- `401` - API Key inválida
- `500` - Erro interno

**Autenticação:**
Requer header `X-API-Key` com valor da variável `API_SECRET_KEY`.

---

## 🔔 WEBHOOKS (ClientFlow)

### Receber Webhook
Endpoint para ClientFlow enviar notificações.

**Endpoint:** `POST /webhooks/clientflow`

**Headers:**
```
X-API-Key: {API_SECRET_KEY}
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "appointment.confirmed",
  "data": {
    "appointmentId": "uuid"
  },
  "timestamp": "2026-02-25T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed",
  "event": "appointment.confirmed"
}
```

**Eventos Suportados:**
- `appointment.confirmed` - Confirmação de agendamento
- `appointment.reminder_sent` - Lembrete enviado
- `customer.updated` - Cliente atualizado
- `metrics.requested` - Solicitar métricas

**Status Codes:**
- `200` - Processado com sucesso
- `400` - Payload inválido
- `401` - API Key inválida
- `500` - Erro interno

---

## 🔒 AUTENTICAÇÃO

### API Pública
Não requer autenticação:
- `GET /barbers`
- `GET /services`
- `POST /appointments/availability`
- `POST /appointments`
- `POST /waitlist`
- `POST /reviews`
- `GET /reviews`

### API Protegida
Requer header `X-API-Key`:
- `GET /clientflow/metrics`
- `POST /webhooks/clientflow`

**Exemplo:**
```bash
curl -H "X-API-Key: sua-api-key" \
  http://localhost:3000/api/clientflow/metrics
```

---

## ⚡ RATE LIMITING

**Limite:** 60 requisições por minuto por IP

**Response quando excedido:**
```json
{
  "error": "Too many requests",
  "retryAfter": 45
}
```

**Status Code:** `429`

**Headers:**
```
Retry-After: 45
```

---

## ❌ CÓDIGOS DE ERRO

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Requisição inválida |
| `401` | Não autorizado |
| `404` | Não encontrado |
| `429` | Muitas requisições |
| `500` | Erro interno do servidor |

**Formato de Erro:**
```json
{
  "error": "Descrição do erro"
}
```

---

## 🧪 EXEMPLOS DE USO

### Criar Agendamento Completo
```bash
# 1. Listar barbeiros
curl http://localhost:3000/api/barbers

# 2. Listar serviços
curl http://localhost:3000/api/services

# 3. Verificar disponibilidade
curl -X POST http://localhost:3000/api/appointments/availability \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "uuid-do-barbeiro",
    "serviceId": "uuid-do-servico",
    "date": "2026-02-25"
  }'

# 4. Criar agendamento
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "uuid-do-barbeiro",
    "serviceId": "uuid-do-servico",
    "customerName": "João Silva",
    "customerPhone": "+55 11 99999-1111",
    "date": "2026-02-25",
    "time": "10:00"
  }'
```

### Obter Métricas
```bash
curl -H "X-API-Key: super-secret-key-change-this-in-production" \
  http://localhost:3000/api/clientflow/metrics
```

---

## 📝 TIPOS TYPESCRIPT

```typescript
// Agendamento
interface Appointment {
  id: string;
  barberId: string;
  serviceId: string;
  customerId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'no_show';
  notes?: string;
}

// Cliente
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

// Avaliação
interface Review {
  id: string;
  appointmentId: string;
  rating: number; // 1-5
  comment?: string;
  approved: boolean;
  token: string;
}
```

---

**API completa e pronta para uso** 🚀
