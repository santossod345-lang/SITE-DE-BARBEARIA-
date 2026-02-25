import { apiError, apiResponse } from '@/lib/api-utils';
import { publicService } from '@/services/public.service';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await publicService.getGalleryBySlug(params.slug);

    if (!data) {
      return apiError('Barbearia não encontrada', 404);
    }

    return apiResponse({
      id: data.id,
      name: data.name,
      gallery: data.gallery,
    });
  } catch {
    return apiError('Erro ao buscar galeria pública', 500);
  }
}
