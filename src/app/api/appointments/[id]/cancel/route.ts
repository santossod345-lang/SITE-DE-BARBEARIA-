import { NextRequest } from 'next/server';
import { appointmentService } from '@/services/appointment.service';
import { clientFlowService } from '@/services/clientflow.service';
import { waitlistService } from '@/services/waitlist.service';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError } from '@/lib/api-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await appointmentService.cancelAppointment(params.id);

    // Busca dados completos
    const fullAppointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { barber: true, customer: true, service: true },
    });

    if (fullAppointment) {
      // Envia evento para ClientFlow
      await clientFlowService.appointmentCanceled(
        fullAppointment,
        fullAppointment.barber,
        fullAppointment.customer
      );

      // Notifica lista de espera
      const notification = await waitlistService.notifyNext(
        fullAppointment.barberId,
        fullAppointment.date,
        fullAppointment.time
      );

      return apiResponse({
        success: true,
        appointment,
        waitlistNotification: notification,
      });
    }

    return apiResponse({ success: true, appointment });
  } catch (error: any) {
    return apiError(error.message, 400);
  }
}
