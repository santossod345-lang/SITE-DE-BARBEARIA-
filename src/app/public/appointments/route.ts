import { z } from 'zod';
import { apiError, apiResponse } from '@/lib/api-utils';
import { publicAppointmentService } from '@/services/public-appointment.service';

const createPublicAppointmentSchema = z.object({
  slug: z.string().min(2),
  barberId: z.string().uuid(),
  serviceId: z.string().uuid(),
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^\+?[\d\s()-]+$/),
  customerEmail: z.string().email().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createPublicAppointmentSchema.safeParse(body);

    if (!validation.success) {
      return apiError(validation.error.errors[0]?.message || 'Dados inválidos', 400);
    }

    const payload = validation.data;
    const appointment = await publicAppointmentService.createAppointment({
      slug: payload.slug,
      barberId: payload.barberId,
      serviceId: payload.serviceId,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      date: new Date(payload.date),
      time: payload.time,
      notes: payload.notes,
    });

    return apiResponse(
      {
        success: true,
        appointment: {
          id: appointment.id,
          date: appointment.date,
          time: appointment.time,
          barber: appointment.barber.name,
          service: appointment.service.name,
          barbershop: appointment.barbershop.name,
          status: appointment.status,
        },
      },
      201
    );
  } catch (error: any) {
    return apiError(error.message || 'Erro ao criar agendamento público', 400);
  }
}
