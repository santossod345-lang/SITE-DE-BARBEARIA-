import { prisma } from '@/lib/prisma';
import { send_whatsapp_message } from '@/services/whatsapp.service';

function normalizeToDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function buildAppointmentDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const value = new Date(date);
  value.setHours(hours, minutes, 0, 0);
  return value;
}

export async function process_upcoming_reminders() {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const fromDate = normalizeToDay(now);
  const toDate = normalizeToDay(oneHourLater);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: {
        in: ['pending', 'confirmed'],
      },
      reminderSent: false,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    include: {
      barbershop: true,
      barber: true,
      service: true,
      customer: true,
    },
  });

  let sentCount = 0;

  for (const appointment of appointments) {
    const appointmentDateTime = buildAppointmentDateTime(appointment.date, appointment.time);
    if (appointmentDateTime < now || appointmentDateTime > oneHourLater) {
      continue;
    }

    const message = [
      `Olá, ${appointment.customer.name}!`,
      `Seu agendamento na ${appointment.barbershop.name} acontece às ${appointment.time}.`,
      `Barbeiro: ${appointment.barber.name}`,
      `Serviço: ${appointment.service.name}`,
    ].join('\n');

    const sent = await send_whatsapp_message(appointment.customer.phone, message);
    if (!sent) {
      continue;
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { reminderSent: true },
    });

    sentCount += 1;
  }

  return {
    scanned: appointments.length,
    sent: sentCount,
  };
}
