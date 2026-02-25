import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avaliações | Barbearia Luxo Dubai',
  description: 'Depoimentos sobre a experiência na Barbearia Luxo Dubai.',
};

const reviews = [
  { name: 'Carlos M.', text: 'Atendimento impecável e corte perfeito. Ambiente premium de verdade.' },
  { name: 'Rafael S.', text: 'Pontualidade e qualidade acima da média. Recomendo totalmente.' },
  { name: 'Eduardo P.', text: 'Experiência excelente do início ao fim. Voltarei com certeza.' },
];

export default function AvaliacoesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title">Avaliações</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.name} className="card">
            <h2 className="text-dubai-gold font-semibold mb-2">{review.name}</h2>
            <p className="text-gray-400">{review.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
