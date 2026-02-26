import type { Metadata } from 'next';
import { fetchReviews, calculateAverageRating } from '@/services/api';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import StarRating from '@/components/StarRating';

export const metadata: Metadata = {
  title: 'Avaliações | Barbearia do Alves',
  description: 'Depoimentos sobre a experiência na Barbearia do Alves.',
};

export default async function AvaliacoesPage() {
  const reviews = await fetchReviews();
  const avgRating = calculateAverageRating(reviews);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Avaliações</h1>
      <p className="text-gray-400 text-center mb-6 max-w-2xl mx-auto">
        Veja o que nossos clientes dizem sobre a experiência na barbearia.
      </p>

      {/* Média geral */}
      <div className="card text-center mb-10 max-w-md mx-auto animate-slide-up">
        <p className="text-gray-400 text-sm mb-2">Avaliação média</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl font-display text-dubai-gold">{avgRating.toFixed(1)}</span>
          <div>
            <StarRating rating={avgRating} size="lg" />
            <p className="text-gray-500 text-xs mt-1">{reviews.length} avaliações</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lista de avaliações */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review: any) => (
              <ReviewCard
                key={review.id}
                customerName={review.customerName}
                rating={review.rating}
                comment={review.comment}
                barberName={review.barberName}
                createdAt={review.createdAt}
              />
            ))}
          </div>
        </div>

        {/* Formulário */}
        <div>
          <ReviewForm professionals={['Bruno', 'Paulo']} />
        </div>
      </div>
    </div>
  );
}
