import { z } from 'zod';
import { apiError, apiResponse } from '@/lib/api-utils';
import { prisma } from '@/lib/prisma';
import { PublicRepository } from '@/repositories/public.repository';
import { availabilityService } from '@/services/availability.service';

const querySchema = z.object({
  barber_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service_id: z.string().uuid().optional(),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const validation = querySchema.safeParse({
      barber_id: url.searchParams.get('barber_id'),
      date: url.searchParams.get('date'),
      service_id: url.searchParams.get('service_id') || undefined,
    });

    if (!validation.success) {
      return apiError(validation.error.errors[0]?.message || 'Parâmetros inválidos', 400);
    }

    const repository = new PublicRepository(prisma);
    const barber = await repository.getBarberById(validation.data.barber_id);
    if (!barber || !barber.isActive) {
      return apiError('Barbeiro não encontrado', 404);
    }

    let duration: number | null = null;

    if (validation.data.service_id) {
      const service = await repository.getServiceById(validation.data.service_id);
      if (!service || service.barbershopId !== barber.barbershopId || !service.isActive) {
        return apiError('Serviço inválido para esta barbearia', 400);
      }
      duration = service.duration;
    } else {
      duration = await repository.getShortestServiceDuration(barber.barbershopId);
    }

    if (!duration) {
      return apiError('Nenhum serviço disponível para calcular a agenda', 400);
    }

    const slots = await availabilityService.getAvailableSlots({
      barberId: barber.id,
      date: new Date(validation.data.date),
      serviceDuration: duration,
    });

    return apiResponse({ slots });
  } catch {
    return apiError('Erro ao buscar disponibilidade', 500);
  }
}
