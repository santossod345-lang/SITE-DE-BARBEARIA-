import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PublicRepository } from '@/repositories/public.repository';
import { availabilityService } from '@/services/availability.service';
import { send_whatsapp_message } from '@/services/whatsapp.service';

interface CreatePublicAppointmentInput {
  slug: string;
  barberId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: Date;
  time: string;
  notes?: string;
}

export class PublicAppointmentService {
  private readonly repository = new PublicRepository(prisma);

  async createAppointment(input: CreatePublicAppointmentInput) {
    const barbershop = await this.repository.getBarbershopBySlug(input.slug);
    if (!barbershop) {
      throw new Error('Barbearia não encontrada');
    }

    const barber = await this.repository.getBarberById(input.barberId);
    if (!barber || barber.barbershopId !== barbershop.id || !barber.isActive) {
      throw new Error('Barbeiro inválido para esta barbearia');
    }

    const service = await this.repository.getServiceById(input.serviceId);
    if (!service || service.barbershopId !== barbershop.id || !service.isActive) {
      throw new Error('Serviço inválido para esta barbearia');
    }

    const slotAvailable = await availabilityService.validateSlotAvailable({
      barberId: input.barberId,
      date: input.date,
      serviceDuration: service.duration,
      time: input.time,
    });

    if (!slotAvailable) {
      throw new Error('Horário indisponível');
    }

    const appointment = await prisma.$transaction(
      async (transaction) => {
        const txRepository = new PublicRepository(transaction);

        const slotStillAvailable = await availabilityService.validateSlotAvailable({
          barberId: input.barberId,
          date: input.date,
          serviceDuration: service.duration,
          time: input.time,
        }, txRepository);

        if (!slotStillAvailable) {
          throw new Error('Conflito detectado. Tente outro horário.');
        }

        let customer = await txRepository.findCustomerByPhone(barbershop.id, input.customerPhone);
        if (!customer) {
          customer = await txRepository.createCustomer({
            barbershopId: barbershop.id,
            name: input.customerName,
            phone: input.customerPhone,
            email: input.customerEmail,
          });
        }

        return txRepository.createAppointment({
          barbershop: { connect: { id: barbershop.id } },
          barber: { connect: { id: input.barberId } },
          service: { connect: { id: input.serviceId } },
          customer: { connect: { id: customer.id } },
          date: input.date,
          time: input.time,
          status: 'confirmed',
          notes: input.notes,
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    const confirmationMessage = [
      `Agendamento confirmado na ${appointment.barbershop.name}!`,
      `Data: ${input.date.toISOString().split('T')[0]}`,
      `Horário: ${appointment.time}`,
      `Serviço: ${appointment.service.name}`,
      `Barbeiro: ${appointment.barber.name}`,
    ].join('\n');

    await send_whatsapp_message(appointment.customer.phone, confirmationMessage);

    return appointment;
  }
}

export const publicAppointmentService = new PublicAppointmentService();
