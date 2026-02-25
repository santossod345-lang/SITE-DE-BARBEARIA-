import { format, parse } from 'date-fns';
import { PublicRepository } from '@/repositories/public.repository';
import { prisma } from '@/lib/prisma';

interface AvailabilityInput {
  barberId: string;
  date: Date;
  serviceDuration: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function isOverlapping(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && startB < endA;
}

export class AvailabilityService {
  private readonly repository = new PublicRepository(prisma);

  async getAvailableSlots(input: AvailabilityInput, repository: PublicRepository = this.repository): Promise<TimeSlot[]> {
    const barber = await repository.getBarberById(input.barberId);
    if (!barber) {
      throw new Error('Barbeiro não encontrado');
    }

    const availability = await repository.getAvailability(input.barberId, input.date);
    if (availability && !availability.isAvailable) {
      return [];
    }

    const startTime = availability?.customStartTime || barber.defaultStartTime;
    const endTime = availability?.customEndTime || barber.defaultEndTime;
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    const appointments = await repository.getActiveAppointmentsForDay(input.barberId, input.date);
    const appointmentRanges = appointments.map((appointment) => {
      const appointmentStart = toMinutes(appointment.time);
      const appointmentEnd = appointmentStart + appointment.service.duration;
      return { start: appointmentStart, end: appointmentEnd };
    });

    const slots: TimeSlot[] = [];
    let currentMinutes = startMinutes;

    while (currentMinutes + input.serviceDuration <= endMinutes) {
      const currentTime = parse(
        `${Math.floor(currentMinutes / 60).toString().padStart(2, '0')}:${(currentMinutes % 60)
          .toString()
          .padStart(2, '0')}`,
        'HH:mm',
        new Date()
      );

      const slotStart = currentMinutes;
      const slotEnd = slotStart + input.serviceDuration;
      const hasConflict = appointmentRanges.some((range) =>
        isOverlapping(slotStart, slotEnd, range.start, range.end)
      );

      slots.push({
        time: format(currentTime, 'HH:mm'),
        available: !hasConflict,
      });

      currentMinutes += 30;
    }

    return slots;
  }

  async validateSlotAvailable(
    input: AvailabilityInput & { time: string },
    repository: PublicRepository = this.repository
  ): Promise<boolean> {
    const slots = await this.getAvailableSlots(input, repository);
    const slot = slots.find((candidate) => candidate.time === input.time);
    return Boolean(slot?.available);
  }
}

export const availabilityService = new AvailabilityService();
