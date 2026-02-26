import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import { fetchServices } from '@/services/api';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Serviços | Barbearia do Alves',
  description: 'Conheça os serviços premium da Barbearia do Alves.',
};

export default async function ServicosPage() {
  const services = await fetchServices();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Serviços</h1>
      <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Atendimento de alta qualidade com foco em resultado e experiência.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service: any) => (
          <article key={service.id || service.name} className="card animate-slide-up group">
            <h2 className="text-2xl font-display text-dubai-gold mb-2">{service.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            {(service.price || service.duration) && (
              <div className="flex items-center justify-between border-t border-dubai-gold/10 pt-3 mt-auto">
                {service.price && (
                  <span className="text-dubai-gold font-semibold">
                    {formatCurrency(service.price)}
                  </span>
                )}
                {service.duration && (
                  <span className="text-gray-500 text-xs">{service.duration} min</span>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="text-center mt-10">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block text-lg">
          ✂️ Agendar Agora
        </a>
      </div>
    </div>
  );
}
