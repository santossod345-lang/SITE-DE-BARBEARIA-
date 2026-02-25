# 🔗 INTEGRAÇÃO CLIENTFLOW - GUIA COMPLETO

## 📋 Visão Geral

Este sistema possui integração bidirecional completa com o ClientFlow SaaS:
- **Outbound**: Envia eventos automáticos para o ClientFlow
- **Inbound**: Recebe webhooks do ClientFlow de volta

## 📤 EVENTOS ENVIADOS PARA CLIENTFLOW

### 1. Appointment Created
Disparado quando um novo agendamento é criado.

```json
POST {CLIENTFLOW_API_URL}/api/external/barbershop/events

{
  "event_type": "appointment_created",
  "barber_id": "uuid",
  "barber_name": "Bruno",
  "customer": {
    "name": "João Silva",
    "phone": "+55 11 99999-1111",
    "email": "joao@example.com"
  },
  "service": "Corte Premium",
  "appointment_date": "2026-02-21",
  "appointment_time": "10:00",
  "status": "confirmed",
  "metadata": {
    "appointment_id": "uuid",
    "price": "120.00",
    "duration": 60
  }
}
```

### 2. Appointment Canceled
Disparado quando um agendamento é cancelado.

```json
{
  "event_type": "appointment_canceled",
  "barber_id": "uuid",
  "barber_name": "Bruno",
  "customer": {
    "name": "João Silva",
    "phone": "+55 11 99999-1111"
  },
  "appointment_date": "2026-02-21",
  "appointment_time": "10:00",
  "status": "canceled",
  "metadata": {
    "appointment_id": "uuid"
  }
}
```

### 3. Appointment Completed
Disparado quando um agendamento é marcado como concluído.

```json
{
  "event_type": "appointment_completed",
  "barber_id": "uuid",
  "barber_name": "Bruno",
  "customer": {
    "name": "João Silva",
    "phone": "+55 11 99999-1111"
  },
  "service": "Corte Premium",
  "appointment_date": "2026-02-21",
  "appointment_time": "10:00",
  "status": "completed",
  "metadata": {
    "appointment_id": "uuid",
    "revenue": "120.00"
  }
}
```

### 4. Review Created
Disparado quando um cliente deixa uma avaliação.

```json
{
  "event_type": "review_created",
  "customer": {
    "name": "João Silva",
    "phone": "+55 11 99999-1111"
  },
  "rating": 5,
  "comment": "Excelente atendimento!",
  "metadata": {
    "appointment_id": "uuid",
    "review_id": "uuid"
  }
}
```

### 5. Waitlist Joined
Disparado quando um cliente entra na lista de espera.

```json
{
  "event_type": "waitlist_joined",
  "barber_id": "uuid",
  "barber_name": "Bruno",
  "customer": {
    "name": "João Silva",
    "phone": "+55 11 99999-1111"
  },
  "service": "Corte Premium",
  "appointment_date": "2026-02-21",
  "metadata": {
    "waitlist_id": "uuid",
    "position": 3
  }
}
```

## 🔄 SISTEMA DE RETRY

### Configuração
- **Tentativas máximas**: 3
- **Intervalo**: A cada 5 minutos (via worker)
- **Fila**: Tabela `integration_queue`

### Fluxo
1. Se o evento falhar ao enviar → entra na fila
2. Worker processa fila a cada 5 minutos
3. Tenta reenviar até 3 vezes
4. Se falhar 3x → marca como `failed`

### Verificar Fila
```powershell
npx prisma studio
# Abra a tabela: integration_queue
```

## 📥 WEBHOOKS RECEBIDOS (INBOUND)

### Endpoint
```
POST /api/webhooks/clientflow
Headers:
  Content-Type: application/json
  X-API-Key: {API_SECRET_KEY}
```

### Eventos Suportados

#### 1. Confirmação de Agendamento
```json
{
  "event": "appointment.confirmed",
  "data": {
    "appointmentId": "uuid"
  },
  "timestamp": "2026-02-20T10:30:00Z"
}
```

#### 2. Lembrete Enviado
```json
{
  "event": "appointment.reminder_sent",
  "data": {
    "reminderId": "uuid",
    "status": "delivered"
  },
  "timestamp": "2026-02-20T10:30:00Z"
}
```

#### 3. Atualização de Cliente
```json
{
  "event": "customer.updated",
  "data": {
    "customerId": "uuid",
    "updates": {
      "email": "novo@email.com",
      "name": "Nome Atualizado"
    }
  },
  "timestamp": "2026-02-20T10:30:00Z"
}
```

#### 4. Solicitação de Métricas
```json
{
  "event": "metrics.requested",
  "data": {},
  "timestamp": "2026-02-20T10:30:00Z"
}
```

## 📊 ENDPOINT DE MÉTRICAS

### Request
```bash
GET /api/clientflow/metrics
Headers:
  X-API-Key: {API_SECRET_KEY}
```

### Response
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
    },
    {
      "barberId": "uuid",
      "barberName": "Paulinho",
      "revenue": 8700.00,
      "appointmentsCount": 68
    }
  ],
  "no_show_rate": 3.5,
  "average_rating": 4.8,
  "active_waitlist": 12,
  "generated_at": "2026-02-20T15:30:00Z"
}
```

## 🔧 CONFIGURAÇÃO

### 1. Variáveis de Ambiente (.env)

```env
# ClientFlow API
CLIENTFLOW_API_URL="https://api.clientflow.com"
CLIENTFLOW_API_KEY="sua-api-key-aqui"

# Segurança
API_SECRET_KEY="chave-secreta-para-webhooks"
```

### 2. Configurar no ClientFlow

No painel do ClientFlow, configure:

**Webhook URL:**
```
https://seu-dominio.com/api/webhooks/clientflow
```

**Headers:**
```
X-API-Key: {sua API_SECRET_KEY}
```

**Eventos para assinar:**
- appointment.confirmed
- appointment.reminder_sent
- customer.updated

## 🧪 TESTAR INTEGRAÇÃO

### 1. Testar Envio de Evento
```powershell
# Criar um agendamento
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "barberId": "uuid-do-barbeiro",
    "serviceId": "uuid-do-servico",
    "customerName": "Teste",
    "customerPhone": "+55 11 99999-9999",
    "date": "2026-02-25",
    "time": "10:00"
  }'

# Verificar logs do worker
# Deve mostrar: "✅ Event sent to ClientFlow: appointment_created"
```

### 2. Testar Webhook Recebido
```powershell
curl -X POST http://localhost:3000/api/webhooks/clientflow \
  -H "Content-Type: application/json" \
  -H "X-API-Key: super-secret-key-change-this-in-production" \
  -d '{
    "event": "appointment.confirmed",
    "data": {
      "appointmentId": "uuid-do-agendamento"
    },
    "timestamp": "2026-02-20T10:30:00Z"
  }'
```

### 3. Testar Métricas
```powershell
curl -H "X-API-Key: super-secret-key-change-this-in-production" \
  http://localhost:3000/api/clientflow/metrics
```

## 📝 LOGS E MONITORAMENTO

### Logs do Worker
O worker mostra todos os eventos processados:

```
🔄 Processing integration queue...
📊 Found 2 pending events
✅ Event sent: appointment_created
❌ Failed retry 1/3: appointment_canceled
📋 Event queued for retry: waitlist_joined
```

### Ver Fila de Integração
```powershell
npx prisma studio
```
Navegue até a tabela `integration_queue` para ver:
- Eventos pendentes
- Tentativas de retry
- Erros ocorridos

## 🚨 TROUBLESHOOTING

### Eventos não estão sendo enviados
1. Verifique as variáveis de ambiente
2. Confirme que o ClientFlow está acessível
3. Veja a tabela `integration_queue` no Prisma Studio
4. Verifique logs do worker

### Webhooks não estão sendo recebidos
1. Confirme que a API Key está correta
2. Teste localmente com curl
3. Use ngrok para expor localhost em produção local
4. Verifique logs do Next.js

### Fila crescendo demais
Se muitos eventos falharem:
1. Verifique credenciais do ClientFlow
2. Confirme que a API está online
3. Limpe eventos old failed:
```sql
DELETE FROM integration_queue 
WHERE status = 'failed' 
AND created_at < NOW() - INTERVAL '7 days';
```

## 🎯 PRÓXIMOS PASSOS

1. **Rate Limiting**: Implementar limite de requisições
2. **Webhooks Assinados**: Adicionar HMAC signature
3. **Retry Exponencial**: Backoff exponencial para retries
4. **Dead Letter Queue**: Fila separada para eventos permanentemente falhados
5. **Monitoramento**: Integrar com Sentry ou similar

---

**Integração robusta e pronta para produção** 🚀
