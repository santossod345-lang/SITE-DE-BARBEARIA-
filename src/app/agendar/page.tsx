import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Agendar | Barbearia Luxo Dubai',
  description: 'Acesse o fluxo de agendamento da Barbearia Luxo Dubai.',
};

export default function AgendarPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
      <h1 className="section-title">Agendamento</h1>
      <p className="text-gray-300 mb-8">
        O agendamento é feito no ClientFlow para garantir disponibilidade em tempo real.
      </p>
      <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">
        Agendar Agora
      </a>
    </div>
  );
}
