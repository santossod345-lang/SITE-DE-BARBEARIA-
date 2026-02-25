import { NextRequest } from 'next/server';
import { z } from 'zod';
import { waitlistService } from '@/services/waitlist.service';
import { clientFlowService } from '@/services/clientflow.service';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, validateRequest } from '@/lib/api-utils';

const joinWaitlistSchema = z.object({
  barberId: z.string().uuid(),
  serviceId: z.string().uuid(),
  customerName: z.string().min(2),
  customerPhone: z.string().regex(/^\+?[\d\s()-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await validateRequest(request, joinWaitlistSchema);
    
    if (error || !data) {
      return apiError(error || 'Dados inválidos', 400);
    }

    const barber = await prisma.barber.findUnique({ where: { id: data.barberId } });
    if (!barber) {
      return apiError('Barbeiro não encontrado', 404);
    }

    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || service.barbershopId !== barber.barbershopId) {
      return apiError('Serviço inválido para esta barbearia', 400);
    }

    // Busca ou cria cliente por barbearia
    let customer = await prisma.customer.findFirst({
      where: {
        barbershopId: barber.barbershopId,
        phone: data.customerPhone,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          barbershopId: barber.barbershopId,
          name: data.customerName,
          phone: data.customerPhone,
        },
      });
    }

    const date = new Date(data.date);
    const waitlistEntry = await waitlistService.joinWaitlist({
      barberId: data.barberId,
      serviceId: data.serviceId,
      customerId: customer.id,
      date,
    });

    // Envia evento para ClientFlow
    await clientFlowService.waitlistJoined(
      waitlistEntry,
      waitlistEntry.barber,
      waitlistEntry.customer,
      waitlistEntry.service
    );

    return apiResponse({
      success: true,
      position: waitlistEntry.position,
      waitlistId: waitlistEntry.id,
    }, 201);
  } catch (error: any) {
    return apiError(error.message, 400);
  }
}
