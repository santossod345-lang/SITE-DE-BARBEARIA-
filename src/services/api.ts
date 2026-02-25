const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Mock data for when API is not available
const mockServices = [
  { id: '1', name: 'Corte Premium', description: 'Consultoria de estilo, corte e finalização.', price: 45, duration: 40 },
  { id: '2', name: 'Barba Completa', description: 'Modelagem, navalha e hidratação.', price: 35, duration: 30 },
  { id: '3', name: 'Corte + Barba', description: 'Pacote completo com acabamento profissional.', price: 70, duration: 60 },
  { id: '4', name: 'Pigmentação', description: 'Coloração e pigmentação para barba ou cabelo.', price: 50, duration: 45 },
  { id: '5', name: 'Hidratação Capilar', description: 'Tratamento profundo para fios saudáveis.', price: 30, duration: 25 },
];

const mockReviews = [
  { id: '1', customerName: 'Carlos M.', rating: 5, comment: 'Atendimento impecável e corte perfeito.', barberName: 'Bruno', createdAt: '2025-12-15' },
  { id: '2', customerName: 'Rafael S.', rating: 5, comment: 'Pontualidade e qualidade acima da média.', barberName: 'Paulo', createdAt: '2025-12-10' },
  { id: '3', customerName: 'Eduardo P.', rating: 4, comment: 'Experiência excelente do início ao fim.', barberName: 'Bruno', createdAt: '2025-11-28' },
  { id: '4', customerName: 'Marcos L.', rating: 5, comment: 'Melhor barbearia da região. Recomendo!', barberName: 'Paulo', createdAt: '2025-11-20' },
  { id: '5', customerName: 'Felipe A.', rating: 4, comment: 'Ambiente top e profissionais excelentes.', barberName: 'Bruno', createdAt: '2025-11-15' },
  { id: '6', customerName: 'João V.', rating: 5, comment: 'Barba perfeita, voltarei com certeza!', barberName: 'Paulo', createdAt: '2025-11-10' },
];

const mockGallery = [
  { id: '1', imageUrl: '/gallery/corte1.jpg', barberName: 'Bruno', description: 'Corte moderno degradê' },
  { id: '2', imageUrl: '/gallery/corte2.jpg', barberName: 'Paulo', description: 'Barba completa estilizada' },
  { id: '3', imageUrl: '/gallery/corte3.jpg', barberName: 'Bruno', description: 'Corte social executivo' },
  { id: '4', imageUrl: '/gallery/corte4.jpg', barberName: 'Paulo', description: 'Pigmentação natural' },
  { id: '5', imageUrl: '/gallery/corte5.jpg', barberName: 'Bruno', description: 'Degradê com risco' },
  { id: '6', imageUrl: '/gallery/corte6.jpg', barberName: 'Paulo', description: 'Corte + barba completo' },
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
    const res = await fetch(`${API_BASE}/api/public/reviews`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
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
