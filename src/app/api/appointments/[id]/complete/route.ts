import { NextRequest } from 'next/server';
import { appointmentService } from '@/services/appointment.service';
import { clientFlowService } from '@/services/clientflow.service';
import { reviewService } from '@/services/review.service';
import { apiResponse, apiError } from '@/lib/api-utils';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await appointmentService.completeAppointment(params.id);

    // Gera token para avaliação
    const reviewToken = reviewService.generateReviewToken();
    
    // Salva token no sistema (pode ser link enviado por WhatsApp)
    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review?token=${reviewToken}&appointment=${params.id}`;

    // Envia evento para ClientFlow
    await clientFlowService.appointmentCompleted(
      appointment,
      appointment.barber,
      appointment.customer,
      appointment.service
    );

    return apiResponse({
      success: true,
      appointment,
      reviewUrl,
    });
  } catch (error: any) {
    return apiError(error.message, 400);
  }
}
