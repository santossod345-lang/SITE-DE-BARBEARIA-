import { NextRequest } from 'next/server';
import { z } from 'zod';
import { reviewService } from '@/services/review.service';
import { clientFlowService } from '@/services/clientflow.service';
import { apiResponse, apiError, validateRequest } from '@/lib/api-utils';

const createReviewSchema = z.object({
  appointmentId: z.string().uuid(),
  token: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await validateRequest(request, createReviewSchema);
    
    if (error || !data) {
      return apiError(error || 'Dados inválidos', 400);
    }

    const review = await reviewService.createReview(data);

    // Envia evento para ClientFlow
    await clientFlowService.reviewCreated(
      review,
      review.appointment,
      review.appointment.customer
    );

    return apiResponse({
      success: true,
      message: 'Avaliação enviada! Aguardando aprovação.',
    }, 201);
  } catch (error: any) {
    return apiError(error.message, 400);
  }
}

export async function GET() {
  try {
    const reviews = await reviewService.getApprovedReviews(20);
    return apiResponse(reviews);
  } catch (error) {
    return apiError('Erro ao buscar avaliações', 500);
  }
}
