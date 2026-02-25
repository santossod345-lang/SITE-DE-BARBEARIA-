import { Prisma, PrismaClient } from '@prisma/client';

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export class PublicRepository {
  constructor(private readonly db: PrismaClient | TransactionClient) {}

  async getBarbershopBySlug(slug: string) {
    return this.db.barbershop.findUnique({
      where: { slug },
    });
  }

  async getBarbershopPublicData(slug: string) {
    return this.db.barbershop.findUnique({
      where: { slug },
      include: {
        barbers: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        galleries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getGalleryBySlug(slug: string) {
    const barbershop = await this.db.barbershop.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!barbershop) return null;

    const gallery = await this.db.gallery.findMany({
      where: { barbershopId: barbershop.id },
      orderBy: { createdAt: 'desc' },
    });

    return {
      ...barbershop,
      gallery,
    };
  }

  async getBarberById(barberId: string) {
    return this.db.barber.findUnique({
      where: { id: barberId },
    });
  }

  async getServiceById(serviceId: string) {
    return this.db.service.findUnique({
      where: { id: serviceId },
    });
  }

  async getAvailability(barberId: string, date: Date) {
    return this.db.availability.findUnique({
      where: {
        barberId_date: {
          barberId,
          date,
        },
      },
    });
  }

  async getActiveAppointmentsForDay(barberId: string, date: Date) {
    return this.db.appointment.findMany({
      where: {
        barberId,
        date,
        status: {
          in: ['pending', 'confirmed'],
        },
      },
      include: {
        service: {
          select: {
            duration: true,
          },
        },
      },
      orderBy: { time: 'asc' },
    });
  }

  async getShortestServiceDuration(barbershopId: string) {
    const service = await this.db.service.findFirst({
      where: {
        barbershopId,
        isActive: true,
      },
      orderBy: { duration: 'asc' },
      select: { duration: true },
    });

    return service?.duration ?? null;
  }

  async findCustomerByPhone(barbershopId: string, phone: string) {
    return this.db.customer.findFirst({
      where: {
        barbershopId,
        phone,
      },
    });
  }

  async createCustomer(data: { barbershopId: string; name: string; phone: string; email?: string | null }) {
    return this.db.customer.create({
      data,
    });
  }

  async createAppointment(data: Prisma.AppointmentCreateInput) {
    return this.db.appointment.create({
      data,
      include: {
        barber: true,
        service: true,
        customer: true,
        barbershop: true,
      },
    });
  }
}
