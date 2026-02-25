import { apiError, apiResponse } from '@/lib/api-utils';
import { publicService } from '@/services/public.service';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const barbershop = await publicService.getBarbershopPublicData(params.slug);

    if (!barbershop) {
      return apiError('Barbearia não encontrada', 404);
    }

    return apiResponse({
      id: barbershop.id,
      name: barbershop.name,
      logo: barbershop.logo,
      whatsapp: barbershop.whatsappNumber,
      barbers: barbershop.barbers,
      services: barbershop.services,
      gallery: barbershop.galleries,
    });
  } catch {
    return apiError('Erro ao buscar dados públicos da barbearia', 500);
  }
}
