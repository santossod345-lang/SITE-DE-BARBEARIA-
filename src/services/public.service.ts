import { prisma } from '@/lib/prisma';
import { PublicRepository } from '@/repositories/public.repository';

export class PublicService {
  private readonly repository = new PublicRepository(prisma);

  async getBarbershopPublicData(slug: string) {
    return this.repository.getBarbershopPublicData(slug);
  }

  async getGalleryBySlug(slug: string) {
    return this.repository.getGalleryBySlug(slug);
  }
}

export const publicService = new PublicService();
