import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Serviços | Barbearia Luxo Dubai',
  description: 'Conheça os serviços premium da Barbearia Luxo Dubai.',
};

const services = [
  {
    name: 'Corte Premium',
    description: 'Consultoria de estilo, corte e finalização para um visual moderno.',
  },
  {
    name: 'Barba Executiva',
    description: 'Desenho de barba, navalha e hidratação com acabamento profissional.',
  },
  {
    name: 'Pacote Completo',
    description: 'Corte + barba + acabamento para experiência completa.',
  },
];

export default function ServicosPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title">Serviços</h1>
      <p className="text-gray-400 mb-8">Atendimento de alta qualidade com foco em resultado e experiência.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.name} className="card">
            <h2 className="text-2xl font-display text-dubai-gold mb-2">{service.name}</h2>
            <p className="text-gray-400">{service.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">
          Agendar Agora
        </a>
      </div>
    </div>
  );
}
