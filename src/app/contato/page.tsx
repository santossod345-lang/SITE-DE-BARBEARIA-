import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contato | Barbearia Alves',
  description: 'Entre em contato com a Barbearia Alves.',
};

export default function ContatoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Contato</h1>
      <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Entre em contato conosco ou visite a barbearia.
      </p>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div className="card space-y-4 text-gray-300 animate-slide-up">
          <h2 className="text-xl font-display text-dubai-gold mb-2">Informações</h2>
          <p><strong className="text-dubai-gold">WhatsApp:</strong> {siteConfig.phone}</p>
          <p><strong className="text-dubai-gold">Endereço:</strong> {siteConfig.address}</p>
          <p><strong className="text-dubai-gold">Horário:</strong> {siteConfig.hours}</p>
          <div className="pt-4 flex flex-col gap-3">
            <a
              href="https://wa.me/5531997529550"
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-center"
            >
              Falar no WhatsApp
            </a>
            <Link href="/localizacao" className="btn-secondary text-center">
              Ver Localização
            </Link>
          </div>
        </div>

        <div className="card animate-slide-up">
          <h2 className="text-xl font-display text-dubai-gold mb-4">Profissionais</h2>
          {siteConfig.professionals.map((pro) => (
            <div key={pro.name} className="flex items-center gap-3 sm:gap-4 mb-4 last:mb-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-dark flex items-center justify-center text-dubai-black text-lg font-bold flex-shrink-0">
                {pro.initial}
              </div>
              <div className="flex-1">
                <h3 className="text-dubai-gold font-semibold">{pro.name}</h3>
                <p className="text-gray-400 text-sm">{pro.role}</p>
              </div>
              <a
                href={`https://wa.me/${pro.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-dubai-gold text-sm hover:text-dubai-gold-light transition-colors shrink-0"
              >
                WhatsApp →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">
          Agendar Agora
        </a>
      </div>

      <div className="text-center mt-10 text-gray-400">
        <p className="mb-2">Desenvolvido por você.</p>
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="text-dubai-gold hover:text-dubai-gold-light transition-colors"
        >
          Instagram: {siteConfig.instagramHandle}
        </a>
      </div>
    </div>
  );
}
