import { prisma } from '@/lib/prisma';
import { availabilityService } from '@/services/availability.service';

interface TimeSlot {
  time: string;
  available: boolean;
}

export class AppointmentService {
  /**
   * Obtém slots de horário disponíveis para um barbeiro em uma data
   */
  async getAvailableSlots(barberId: string, date: Date, serviceId: string): Promise<TimeSlot[]> {
    const barber = await prisma.barber.findUnique({ where: { id: barberId } });
    if (!barber) throw new Error('Barbeiro não encontrado');

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('Serviço não encontrado');

    if (barber.barbershopId !== service.barbershopId) {
      throw new Error('Barbeiro e serviço não pertencem à mesma barbearia');
    }

    return availabilityService.getAvailableSlots({
      barberId,
      date,
      serviceDuration: service.duration,
    });
  }

  /**
   * Cria um novo agendamento
   */
  async createAppointment(data: {
    barberId: string;
    serviceId: string;
    customerName: string;
    customerPhone: string;
    barbershopId?: string;
    date: Date;
    time: string;
    notes?: string;
  }) {
    const barber = await prisma.barber.findUnique({ where: { id: data.barberId } });
    if (!barber) throw new Error('Barbeiro não encontrado');

    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error('Serviço não encontrado');

    const barbershopId = data.barbershopId ?? barber.barbershopId;

    if (
      barber.barbershopId !== service.barbershopId ||
      barber.barbershopId !== barbershopId ||
      service.barbershopId !== barbershopId
    ) {
      throw new Error('Barbeiro/serviço não pertencem à mesma barbearia');
    }

    const available = await availabilityService.validateSlotAvailable({
      barberId: data.barberId,
      date: data.date,
      serviceDuration: service.duration,
      time: data.time,
    });

    if (!available) throw new Error('Este horário já está reservado');

    // Busca ou cria cliente
    let customer = await prisma.customer.findFirst({
      where: {
        barbershopId: barber.barbershopId,
        phone: data.customerPhone,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          barbershopId,
          name: data.customerName,
          phone: data.customerPhone,
        },
      });
    }

    // Cria agendamento
    const appointment = await prisma.appointment.create({
      data: {
        barbershopId,
        barberId: data.barberId,
        serviceId: data.serviceId,
        customerId: customer.id,
        date: data.date,
        time: data.time,
        notes: data.notes,
        status: 'confirmed',
      },
      include: {
        barber: true,
        service: true,
        customer: true,
      },
    });

    // Cria lembretes automáticos
    await this.createReminders(appointment);

    return appointment;
  }

  /**
   * Cancela um agendamento
   */
  async cancelAppointment(appointmentId: string) {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'canceled' },
      include: {
        barber: true,
        service: true,
      },
    });

    return appointment;
  }

  /**
   * Completa um agendamento
   */
  async completeAppointment(appointmentId: string) {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'completed' },
      include: {
        barber: true,
        service: true,
        customer: true,
      },
    });

    // Cria lembrete para avaliação
    await this.createReviewReminder(appointment);

    return appointment;
  }

  /**
   * Cria lembretes automáticos
   */
  private async createReminders(appointment: any) {
    const appointmentDateTime = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':');
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

    // Lembrete 24h antes
    const reminder24h = new Date(appointmentDateTime);
    reminder24h.setHours(reminder24h.getHours() - 24);

    await prisma.reminder.create({
      data: {
        appointmentId: appointment.id,
        type: 'reminder_24h',
        scheduledFor: reminder24h,
        status: 'pending',
      },
    });

    // Lembrete 2h antes
    const reminder2h = new Date(appointmentDateTime);
    reminder2h.setHours(reminder2h.getHours() - 2);

    await prisma.reminder.create({
      data: {
        appointmentId: appointment.id,
        type: 'reminder_2h',
        scheduledFor: reminder2h,
        status: 'pending',
      },
    });
  }

  /**
   * Cria lembrete para avaliação
   */
  private async createReviewReminder(appointment: any) {
    // 1 hora após conclusão
    const reviewTime = new Date();
    reviewTime.setHours(reviewTime.getHours() + 1);

    await prisma.reminder.create({
      data: {
        appointmentId: appointment.id,
        type: 'review_request',
        scheduledFor: reviewTime,
        status: 'pending',
      },
    });
  }
}

export const appointmentService = new AppointmentService();
