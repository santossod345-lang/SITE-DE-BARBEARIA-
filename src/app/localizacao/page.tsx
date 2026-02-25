import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Localização | Barbearia do Alves',
  description: 'Veja como chegar na Barbearia do Alves.',
};

export default function LocalizacaoPage() {
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Localização</h1>
      <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Visite a {siteConfig.name}. Estamos esperando por você!
      </p>

      {/* Mapa */}
      <div className="card overflow-hidden mb-8 animate-slide-up p-0">
        <iframe
          src={siteConfig.mapEmbedUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização da Barbearia do Alves"
          className="w-full"
        />
      </div>

      {/* Info e ações */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card animate-slide-up">
          <h2 className="text-xl font-display text-dubai-gold mb-4">📍 Endereço</h2>
          <p className="text-gray-300 mb-2">{siteConfig.address}</p>
          <p className="text-gray-400 text-sm mb-4">
            <strong className="text-dubai-gold">Horário:</strong> {siteConfig.hours}
          </p>
          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-block"
          >
            🗺️ Como Chegar
          </a>
        </div>

        <div className="card animate-slide-up">
          <h2 className="text-xl font-display text-dubai-gold mb-4">📞 Contato Rápido</h2>
          <div className="space-y-3 text-gray-300">
            <p><strong className="text-dubai-gold">Telefone:</strong> {siteConfig.phone}</p>
            {siteConfig.professionals.map((pro) => (
              <div key={pro.name} className="flex items-center justify-between">
                <span>{pro.name} - {pro.role}</span>
                <a
                  href={`https://wa.me/${pro.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-dubai-gold text-sm hover:text-dubai-gold-light transition-colors"
                >
                  WhatsApp →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block text-lg">
          ✂️ Agendar Agora
        </a>
      </div>
    </div>
  );
}
