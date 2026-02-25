import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { validateApiKey, apiResponse, apiError } from '@/lib/api-utils';

// Schema de validação para webhook do ClientFlow
const webhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  timestamp: z.string(),
});

/**
 * Webhook endpoint para receber eventos do ClientFlow
 * 
 * O ClientFlow pode enviar notificações de volta para este endpoint
 * quando necessário (ex: confirmação de processamento, atualizações)
 */
export async function POST(request: NextRequest) {
  // Valida API Key
  if (!validateApiKey(request)) {
    return apiError('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const validation = webhookSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Invalid webhook payload', 400);
    }

    const { event, data, timestamp } = validation.data;

    console.log(`📨 Webhook received from ClientFlow:`, {
      event,
      timestamp,
      data,
    });

    // Processa diferentes tipos de eventos
    switch (event) {
      case 'appointment.confirmed':
        await handleAppointmentConfirmed(data);
        break;

      case 'appointment.reminder_sent':
        await handleReminderSent(data);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(data);
        break;

      case 'metrics.requested':
        // ClientFlow pode solicitar métricas atualizadas
        return await getMetrics();

      default:
        console.log(`⚠️  Unknown event type: ${event}`);
    }

    return apiResponse({
      success: true,
      message: 'Webhook processed',
      event,
    });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return apiError(error.message, 500);
  }
}

async function handleAppointmentConfirmed(data: any) {
  const { appointmentId } = data;

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: 'confirmed' },
  });

  console.log(`✅ Appointment ${appointmentId} confirmed via webhook`);
}

async function handleReminderSent(data: any) {
  const { reminderId, status } = data;

  await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      status: status === 'delivered' ? 'sent' : 'failed',
      sentAt: new Date(),
    },
  });

  console.log(`✅ Reminder ${reminderId} status updated: ${status}`);
}

async function handleCustomerUpdated(data: any) {
  const { customerId, updates } = data;

  await prisma.customer.update({
    where: { id: customerId },
    data: updates,
  });

  console.log(`✅ Customer ${customerId} updated via webhook`);
}

async function getMetrics() {
  const totalAppointments = await prisma.appointment.count();

  const completedAppointments = await prisma.appointment.findMany({
    where: { status: 'completed' },
    include: { service: true },
  });

  const revenueTotal = completedAppointments.reduce(
    (sum: number, apt: (typeof completedAppointments)[number]) => sum + Number(apt.service.price),
    0
  );

  const reviews = await prisma.review.findMany({
    where: { approved: true },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: (typeof reviews)[number]) => sum + r.rating, 0) / reviews.length
    : 0;

  return apiResponse({
    metrics: {
      total_appointments: totalAppointments,
      revenue_total: revenueTotal,
      average_rating: Math.round(averageRating * 10) / 10,
      total_reviews: reviews.length,
    },
  });
}
