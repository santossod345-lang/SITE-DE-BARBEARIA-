import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export class ReviewService {
  /**
   * Gera token único para avaliação
   */
  generateReviewToken(): string {
    return nanoid(32);
  }

  /**
   * Cria uma nova avaliação
   */
  async createReview(data: {
    appointmentId: string;
    token: string;
    rating: number;
    comment?: string;
  }) {
    // Valida token
    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
      include: { review: true },
    });

    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    if (appointment.review) {
      throw new Error('Este agendamento já possui uma avaliação');
    }

    if (appointment.status !== 'completed') {
      throw new Error('Apenas agendamentos concluídos podem ser avaliados');
    }

    // Valida rating
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Avaliação deve ser entre 1 e 5');
    }

    const review = await prisma.review.create({
      data: {
        appointmentId: data.appointmentId,
        token: data.token,
        rating: data.rating,
        comment: data.comment,
        approved: false, // Precisa aprovação
      },
      include: {
        appointment: {
          include: {
            barber: true,
            service: true,
            customer: true,
          },
        },
      },
    });

    return review;
  }

  /**
   * Aprova uma avaliação
   */
  async approveReview(reviewId: string) {
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { approved: true },
    });

    return review;
  }

  /**
   * Lista avaliações aprovadas
   */
  async getApprovedReviews(limit = 10) {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      include: {
        appointment: {
          include: {
            barber: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return reviews;
  }

  /**
   * Lista avaliações pendentes de aprovação
   */
  async getPendingReviews() {
    const reviews = await prisma.review.findMany({
      where: { approved: false },
      include: {
        appointment: {
          include: {
            barber: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  }

  /**
   * Calcula média de avaliações de um barbeiro
   */
  async getBarberRating(barberId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        approved: true,
        appointment: {
          barberId,
        },
      },
    });

    if (reviews.length === 0) {
      return { average: 0, total: 0 };
    }

    const sum = reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    const average = sum / reviews.length;

    return {
      average: Math.round(average * 10) / 10,
      total: reviews.length,
    };
  }
}

export const reviewService = new ReviewService();
