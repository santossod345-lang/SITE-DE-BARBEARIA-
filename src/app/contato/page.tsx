import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contato | Barbearia Luxo Dubai',
  description: 'Entre em contato com a Barbearia Luxo Dubai.',
};

export default function ContatoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title">Contato</h1>

      <div className="card space-y-3 text-gray-300">
        <p><strong className="text-dubai-gold">WhatsApp:</strong> (11) 99999-9999</p>
        <p><strong className="text-dubai-gold">Endereço:</strong> Rua Exemplo, 123 - Centro</p>
        <p><strong className="text-dubai-gold">Horário:</strong> Seg a Sáb, 09:00 às 20:00</p>
      </div>

      <div className="mt-8">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">
          Agendar Agora
        </a>
      </div>
    </div>
  );
}
