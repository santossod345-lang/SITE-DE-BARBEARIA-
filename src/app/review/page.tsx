import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import ReviewForm from '@/components/ReviewForm';

export const metadata: Metadata = {
  title: 'Review | Barbearia do Alves',
  description: 'Página institucional de avaliação e relacionamento com clientes.',
};

export default function ReviewPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Obrigado pela visita</h1>
      <p className="text-gray-300 text-center mb-8">
        Sua opinião é muito importante. Deixe sua avaliação abaixo!
      </p>
      <ReviewForm professionals={['Bruno', 'Paulo']} />
      <div className="text-center mt-8">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-secondary inline-block">
          Agendar Próxima Visita
        </a>
      </div>
    </div>
  );
}
