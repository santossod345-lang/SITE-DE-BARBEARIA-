import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse, apiError, validateApiKey } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  // Valida API Key
  if (!validateApiKey(request)) {
    return apiError('Unauthorized', 401);
  }

  try {
    // Total de agendamentos
    const totalAppointments = await prisma.appointment.count();

    // Receita total
    const completedAppointments = await prisma.appointment.findMany({
      where: { status: 'completed' },
      include: { service: true },
    });

    const revenueTotal = completedAppointments.reduce(
      (sum: number, apt: any) => sum + Number(apt.service.price),
      0
    );

    // Receita por barbeiro
    const barbers = await prisma.barber.findMany();
    const revenueByBarber = await Promise.all(
      barbers.map(async (barber: any) => {
        const barberAppointments = await prisma.appointment.findMany({
          where: {
            barberId: barber.id,
            status: 'completed',
          },
          include: { service: true },
        });

        const revenue = barberAppointments.reduce(
          (sum: number, apt: any) => sum + Number(apt.service.price),
          0
        );

        return {
          barberId: barber.id,
          barberName: barber.name,
          revenue,
          appointmentsCount: barberAppointments.length,
        };
      })
    );

    // Taxa de no-show
    const noShowCount = await prisma.appointment.count({
      where: { status: 'no_show' },
    });
    const noShowRate = totalAppointments > 0 
      ? (noShowCount / totalAppointments) * 100 
      : 0;

    // Média de avaliações
    const reviews = await prisma.review.findMany({
      where: { approved: true },
    });
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 0;

    // Lista de espera ativa
    const activeWaitlist = await prisma.waitlist.count({
      where: { notified: false },
    });

    return apiResponse({
      total_appointments: totalAppointments,
      revenue_total: revenueTotal,
      revenue_by_barber: revenueByBarber,
      no_show_rate: Math.round(noShowRate * 100) / 100,
      average_rating: Math.round(averageRating * 10) / 10,
      active_waitlist: activeWaitlist,
      generated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
