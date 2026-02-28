import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import ProfessionalCard from '@/components/ProfessionalCard';
import { fetchReviews, calculateAverageRating } from '@/services/api';

export const metadata: Metadata = {
  title: 'Profissionais | Barbearia Alves',
  description: 'Conheça Bruno e Paulo, os profissionais da Barbearia Alves.',
};

export default async function ProfissionaisPage() {
  const reviews = await fetchReviews();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Nossos Profissionais</h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Conheça a equipe que faz a diferença na {siteConfig.name}. Profissionais dedicados
        a entregar o melhor resultado para você.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {siteConfig.professionals.map((pro) => {
          const proReviews = reviews.filter((r: any) => r.barberName === pro.name);
          const proRating = calculateAverageRating(proReviews);
          return (
            <ProfessionalCard
              key={pro.name}
              name={pro.name}
              role={pro.role}
              bio={pro.bio}
              specialties={pro.specialties}
              rating={proRating || 4.8}
              reviewCount={proReviews.length || 15}
              imageInitial={pro.initial}
              whatsapp={pro.whatsapp}
            />
          );
        })}
      </div>

      <div className="text-center mt-12">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block text-lg">
          ✂️ Agendar com um Profissional
        </a>
      </div>
    </div>
  );
}
