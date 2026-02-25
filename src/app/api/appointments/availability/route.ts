import { NextRequest } from 'next/server';
import { z } from 'zod';
import { appointmentService } from '@/services/appointment.service';
import { apiResponse, apiError, validateRequest } from '@/lib/api-utils';

const availabilitySchema = z.object({
  barberId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await validateRequest(request, availabilitySchema);
    
    if (error || !data) {
      return apiError(error || 'Dados inválidos', 400);
    }

    const date = new Date(data.date);
    const slots = await appointmentService.getAvailableSlots(
      data.barberId,
      date,
      data.serviceId
    );

    return apiResponse({ slots });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
