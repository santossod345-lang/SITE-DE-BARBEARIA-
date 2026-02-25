import { prisma } from '@/lib/prisma';

export class WaitlistService {
  /**
   * Adiciona cliente à lista de espera
   */
  async joinWaitlist(data: {
    barberId: string;
    serviceId: string;
    customerId: string;
    date: Date;
  }) {
    // Conta quantos já estão na fila
    const currentPosition = await prisma.waitlist.count({
      where: {
        barberId: data.barberId,
        date: data.date,
      },
    });

    const waitlistEntry = await prisma.waitlist.create({
      data: {
        barberId: data.barberId,
        serviceId: data.serviceId,
        customerId: data.customerId,
        date: data.date,
        position: currentPosition + 1,
      },
      include: {
        barber: true,
        service: true,
        customer: true,
      },
    });

    return waitlistEntry;
  }

  /**
   * Notifica próximo da lista quando houver cancelamento
   */
  async notifyNext(barberId: string, date: Date, time: string) {
    // Busca primeiro não notificado
    const nextInLine = await prisma.waitlist.findFirst({
      where: {
        barberId,
        date,
        notified: false,
      },
      orderBy: { position: 'asc' },
      include: {
        customer: true,
        service: true,
      },
    });

    if (!nextInLine) {
      return null;
    }

    // Define expiração em 30 minutos
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Marca como notificado
    await prisma.waitlist.update({
      where: { id: nextInLine.id },
      data: {
        notified: true,
        expiresAt,
      },
    });

    return {
      customer: nextInLine.customer,
      service: nextInLine.service,
      time,
      expiresAt,
    };
  }

  /**
   * Remove entradas expiradas da lista de espera
   */
  async cleanExpired() {
    const now = new Date();
    
    const expired = await prisma.waitlist.findMany({
      where: {
        notified: true,
        expiresAt: {
          lt: now,
        },
      },
    });

    for (const entry of expired) {
      await prisma.waitlist.delete({
        where: { id: entry.id },
      });

      // Recalcula posições
      await this.recalculatePositions(entry.barberId, entry.date);
    }

    return expired.length;
  }

  /**
   * Recalcula posições após remoção
   */
  private async recalculatePositions(barberId: string, date: Date) {
    const entries = await prisma.waitlist.findMany({
      where: { barberId, date },
      orderBy: { position: 'asc' },
    });

    for (let i = 0; i < entries.length; i++) {
      await prisma.waitlist.update({
        where: { id: entries[i].id },
        data: { position: i + 1 },
      });
    }
  }

  /**
   * Remove da lista de espera (quando confirmar agendamento)
   */
  async removeFromWaitlist(waitlistId: string) {
    const entry = await prisma.waitlist.delete({
      where: { id: waitlistId },
    });

    // Recalcula posições
    await this.recalculatePositions(entry.barberId, entry.date);

    return entry;
  }
}

export const waitlistService = new WaitlistService();
