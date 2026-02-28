import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import ReviewForm from '@/components/ReviewForm';

export const metadata: Metadata = {
  title: 'Review | Barbearia Alves',
  description: 'Página institucional de avaliação e relacionamento com clientes.',
};

export default function ReviewPage({
  searchParams,
}: {
  searchParams: { appointment?: string; token?: string };
}) {
  const appointmentId = searchParams?.appointment;
  const token = searchParams?.token;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Obrigado pela visita</h1>
      <p className="text-gray-300 text-center mb-8">
        Sua opinião é muito importante. Deixe sua avaliação abaixo!
      </p>
      {!appointmentId || !token ? (
        <div className="card text-center text-yellow-300">
          Link de avaliação inválido. Solicite um novo link no WhatsApp da barbearia.
        </div>
      ) : (
        <ReviewForm
          professionals={['Bruno', 'Paulo']}
          appointmentId={appointmentId}
          token={token}
        />
      )}
      <div className="text-center mt-8">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-secondary inline-block">
          Agendar Próxima Visita
        </a>
      </div>
    </div>
  );
}

