const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Mock data for when API is not available
const mockServices = [
  { id: '1', name: 'Corte Premium', description: 'Consultoria de estilo, corte e finalização.', price: 35, duration: 40 },
  { id: '2', name: 'Barba Completa', description: 'Modelagem, navalha e hidratação.', price: 30, duration: 30 },
  { id: '3', name: 'Corte + Barba', description: 'Pacote completo com acabamento profissional.', price: 65, duration: 60 },
  { id: '4', name: 'Pigmentação', description: 'Coloração e pigmentação para barba ou cabelo.', price: 25, duration: 45 },
  { id: '5', name: 'Hidratação Capilar', description: 'Tratamento profundo para fios saudáveis.', price: 25, duration: 25 },
  { id: '6', name: 'Sobrancelha', description: 'Design e acabamento de sobrancelha.', price: 10, duration: 15 },
];

const mockReviews = [
  { id: '1', customerName: 'Carlos M.', rating: 5, comment: 'Atendimento impecável e corte perfeito.', barberName: 'Bruno', createdAt: '2025-12-15' },
  { id: '2', customerName: 'Rafael S.', rating: 5, comment: 'Pontualidade e qualidade acima da média.', barberName: 'Paulo', createdAt: '2025-12-10' },
  { id: '3', customerName: 'Eduardo P.', rating: 5, comment: 'Experiência excelente do início ao fim.', barberName: 'Bruno', createdAt: '2025-11-28' },
  { id: '4', customerName: 'Marcos L.', rating: 5, comment: 'Melhor barbearia da região. Recomendo!', barberName: 'Paulo', createdAt: '2025-11-20' },
  { id: '5', customerName: 'Felipe A.', rating: 5, comment: 'Ambiente top e profissionais excelentes.', barberName: 'Bruno', createdAt: '2025-11-15' },
  { id: '6', customerName: 'João V.', rating: 5, comment: 'Barba perfeita, voltarei com certeza!', barberName: 'Paulo', createdAt: '2025-11-10' },
];

const mockGallery = [
  { id: '1', imageUrl: '/gallery/8d430577-7144-4c49-b915-a6f94f0667f0.jpg', barberName: 'Bruno', description: 'Bruno - Corte com acabamento profissional' },
  { id: '2', imageUrl: '/gallery/e458b9f7-67c0-4960-990f-c9365abf4b98.jpg', barberName: 'Bruno', description: 'Bruno - Degrade com topo texturizado' },
  { id: '3', imageUrl: '/gallery/WhatsApp Image 2026-02-22 at 17.51.40.jpeg', barberName: 'Bruno', description: 'Bruno - Corte social com linha frontal marcada' },
  { id: '4', imageUrl: '/gallery/WhatsApp Image 2026-02-22 at 17.51.40 (1).jpeg', barberName: 'Bruno', description: 'Bruno - Estilo moderno com fade limpo' },
  { id: '5', imageUrl: '/gallery/WhatsApp Image 2026-02-22 at 17.51.40 (2).jpeg', barberName: 'Bruno', description: 'Bruno - Acabamento detalhado na lateral' },
  { id: '6', imageUrl: '/gallery/WhatsApp Image 2026-02-22 at 17.51.40 (3).jpeg', barberName: 'Bruno', description: 'Bruno - Corte com definicao e simetria' },
  { id: '7', imageUrl: '/gallery/WhatsApp Image 2026-02-22 at 17.51.41.jpeg', barberName: 'Bruno', description: 'Bruno - Visual atualizado com acabamento premium' },
];

// API fetch functions with fallback
export async function fetchServices() {
  try {
    const res = await fetch(`${API_BASE}/api/public/services`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return mockServices;
  }
}

export async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE}/api/reviews`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();

    // Prisma shape -> UI shape
    if (Array.isArray(data)) {
      return data.map((review: any) => ({
        id: review.id,
        customerName: review.appointment?.customer?.name || 'Cliente',
        rating: review.rating,
        comment: review.comment || '',
        barberName: review.appointment?.barber?.name || '',
        createdAt: review.createdAt,
      }));
    }

    return data;
  } catch {
    return mockReviews;
  }
}

export async function fetchGallery() {
  try {
    const res = await fetch(`${API_BASE}/api/public/gallery`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return mockGallery;
  }
}

export async function createBooking(data: any) {
  try {
    const res = await fetch(`${API_BASE}/api/public/create-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Booking failed');
    return await res.json();
  } catch {
    return { success: false, error: 'Serviço temporariamente indisponível. Entre em contato pelo WhatsApp.' };
  }
}

export function calculateAverageRating(reviews: Array<{ rating: number }>): number {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

