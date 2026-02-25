import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Review | Barbearia Luxo Dubai',
  description: 'Página institucional de avaliação e relacionamento com clientes.',
};

export default function ReviewPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
      <h1 className="section-title">Obrigado pela visita</h1>
      <p className="text-gray-300 mb-8">
        Esta área será integrada novamente ao fluxo de avaliações da API em uma próxima etapa.
      </p>
      <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">
        Agendar Agora
      </a>
    </div>
  );
}
