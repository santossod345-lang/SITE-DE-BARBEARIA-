import axios, { AxiosError } from 'axios';
import { prisma } from '@/lib/prisma';

interface ClientFlowEvent {
  event_type: string;
  barber_id?: string;
  barber_name?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  service?: string;
  appointment_date?: string;
  appointment_time?: string;
  status?: string;
  rating?: number;
  comment?: string;
  metadata?: Record<string, any>;
}

class ClientFlowService {
  private apiUrl: string;
  private apiKey: string;
  private maxRetries = 3;

  constructor() {
    this.apiUrl = process.env.CLIENTFLOW_API_URL || '';
    this.apiKey = process.env.CLIENTFLOW_API_KEY || '';
  }

  /**
   * Envia evento para o ClientFlow
   */
  async sendEvent(event: ClientFlowEvent): Promise<boolean> {
    if (!this.apiUrl || !this.apiKey) {
      console.warn('ClientFlow credentials not configured');
      await this.queueEvent(event);
      return false;
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/api/external/barbershop/events`,
        event,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'X-API-Key': this.apiKey,
          },
          timeout: 10000, // 10 segundos
        }
      );

      console.log(`✅ Event sent to ClientFlow: ${event.event_type}`, response.data);
      return true;
    } catch (error) {
      console.error('❌ Failed to send event to ClientFlow:', error);
      await this.queueEvent(event);
      return false;
    }
  }

  /**
   * Adiciona evento na fila para reenvio posterior
   */
  private async queueEvent(event: ClientFlowEvent): Promise<void> {
    try {
      await prisma.integrationQueue.create({
        data: {
          eventType: event.event_type,
          payload: JSON.stringify(event),
          status: 'pending',
          retries: 0,
        },
      });
      console.log(`📋 Event queued for retry: ${event.event_type}`);
    } catch (error) {
      console.error('Failed to queue event:', error);
    }
  }

  /**
   * Processa fila de eventos pendentes
   */
  async processQueue(): Promise<void> {
    const pendingEvents = await prisma.integrationQueue.findMany({
      where: {
        status: 'pending',
        retries: { lt: this.maxRetries },
      },
      take: 10,
      orderBy: { createdAt: 'asc' },
    });

    for (const queueItem of pendingEvents) {
      try {
        const event: ClientFlowEvent = JSON.parse(queueItem.payload);
        
        const response = await axios.post(
          `${this.apiUrl}/api/external/barbershop/events`,
          event,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'X-API-Key': this.apiKey,
            },
            timeout: 10000,
          }
        );

        // Sucesso - marcar como enviado
        await prisma.integrationQueue.update({
          where: { id: queueItem.id },
          data: { status: 'sent', lastAttempt: new Date() },
        });

        console.log(`✅ Queued event sent: ${event.event_type}`);
      } catch (error) {
        const axiosError = error as AxiosError;
        const newRetries = queueItem.retries + 1;
        
        // Atualizar com erro
        await prisma.integrationQueue.update({
          where: { id: queueItem.id },
          data: {
            retries: newRetries,
            lastAttempt: new Date(),
            status: newRetries >= this.maxRetries ? 'failed' : 'pending',
            error: axiosError.message,
          },
        });

        console.error(`❌ Failed retry ${newRetries}/${this.maxRetries} for event ${queueItem.eventType}`);
      }
    }
  }

  /**
   * Eventos específicos
   */
  async appointmentCreated(appointment: any, barber: any, service: any, customer: any) {
    return this.sendEvent({
      event_type: 'appointment_created',
      barber_id: barber.id,
      barber_name: barber.name,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
      service: service.name,
      appointment_date: appointment.date.toISOString().split('T')[0],
      appointment_time: appointment.time,
      status: appointment.status,
      metadata: {
        appointment_id: appointment.id,
        price: service.price.toString(),
        duration: service.duration,
      },
    });
  }

  async appointmentCanceled(appointment: any, barber: any, customer: any) {
    return this.sendEvent({
      event_type: 'appointment_canceled',
      barber_id: barber.id,
      barber_name: barber.name,
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      appointment_date: appointment.date.toISOString().split('T')[0],
      appointment_time: appointment.time,
      status: 'canceled',
      metadata: {
        appointment_id: appointment.id,
      },
    });
  }

  async appointmentCompleted(appointment: any, barber: any, customer: any, service: any) {
    return this.sendEvent({
      event_type: 'appointment_completed',
      barber_id: barber.id,
      barber_name: barber.name,
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      service: service.name,
      appointment_date: appointment.date.toISOString().split('T')[0],
      appointment_time: appointment.time,
      status: 'completed',
      metadata: {
        appointment_id: appointment.id,
        revenue: service.price.toString(),
      },
    });
  }

  async reviewCreated(review: any, appointment: any, customer: any) {
    return this.sendEvent({
      event_type: 'review_created',
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      rating: review.rating,
      comment: review.comment,
      metadata: {
        appointment_id: appointment.id,
        review_id: review.id,
      },
    });
  }

  async waitlistJoined(waitlist: any, barber: any, customer: any, service: any) {
    return this.sendEvent({
      event_type: 'waitlist_joined',
      barber_id: barber.id,
      barber_name: barber.name,
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      service: service.name,
      appointment_date: waitlist.date.toISOString().split('T')[0],
      metadata: {
        waitlist_id: waitlist.id,
        position: waitlist.position,
      },
    });
  }
}

export const clientFlowService = new ClientFlowService();
