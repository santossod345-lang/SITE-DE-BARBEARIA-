import { NextRequest } from 'next/server';
import { z } from 'zod';
import { appointmentService } from '@/services/appointment.service';
import { clientFlowService } from '@/services/clientflow.service';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, validateRequest } from '@/lib/api-utils';

const createAppointmentSchema = z.object({
  barberId: z.string().uuid(),
  serviceId: z.string().uuid(),
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^\+?[\d\s()-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await validateRequest(request, createAppointmentSchema);
    
    if (error || !data) {
      return apiError(error || 'Dados inválidos', 400);
    }

    const date = new Date(data.date);
    
    const appointment = await appointmentService.createAppointment({
      barberId: data.barberId,
      serviceId: data.serviceId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      date,
      time: data.time,
      notes: data.notes,
    });

    // Envia evento para ClientFlow
    await clientFlowService.appointmentCreated(
      appointment,
      appointment.barber,
      appointment.service,
      appointment.customer
    );

    return apiResponse({
      success: true,
      appointment: {
        id: appointment.id,
        barber: appointment.barber.name,
        service: appointment.service.name,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
      },
    }, 201);
  } catch (error: any) {
    return apiError(error.message, 400);
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        barber: true,
        service: true,
        customer: true,
      },
      orderBy: { date: 'desc' },
      take: 50,
    });

    return apiResponse(appointments);
  } catch (error) {
    return apiError('Erro ao buscar agendamentos', 500);
  }
}
