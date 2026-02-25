import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Sobre | Barbearia Luxo Dubai',
  description: 'Conheça a história e proposta da Barbearia Luxo Dubai.',
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title">Sobre</h1>
      <div className="card space-y-4 text-gray-300 leading-relaxed">
        <p>
          A Barbearia Luxo Dubai nasceu para entregar um padrão premium de atendimento masculino,
          combinando técnica, estilo e ambiente sofisticado.
        </p>
        <p>
          Nosso foco é oferecer uma experiência prática e de alto nível, com profissionais preparados
          para valorizar sua imagem em cada detalhe.
        </p>
      </div>

      <div className="mt-8">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">
          Agendar Agora
        </a>
      </div>
    </div>
  );
}
