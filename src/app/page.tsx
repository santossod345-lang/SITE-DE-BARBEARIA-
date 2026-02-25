import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function HomePage() {
  return (
    <div className="px-4 py-12 sm:py-20">
      <section className="max-w-6xl mx-auto text-center">
        <h1 className="font-display text-4xl sm:text-6xl text-dubai-gold mb-6">Barbearia Luxo Dubai</h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
          Estilo, precisão e experiência premium para homens que valorizam imagem e atendimento de alto padrão.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">
            Agendar Agora
          </a>
          <Link href="/servicos" className="btn-secondary">Ver Serviços</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="card">
          <h2 className="text-2xl text-dubai-gold font-display mb-2">Corte Premium</h2>
          <p className="text-gray-400">Acabamento de alto nível com técnica personalizada para o seu perfil.</p>
        </article>
        <article className="card">
          <h2 className="text-2xl text-dubai-gold font-display mb-2">Barba Completa</h2>
          <p className="text-gray-400">Modelagem, alinhamento e finalização para um visual impecável.</p>
        </article>
        <article className="card">
          <h2 className="text-2xl text-dubai-gold font-display mb-2">Experiência Executiva</h2>
          <p className="text-gray-400">Pacote completo para quem busca presença e sofisticação.</p>
        </article>
      </section>
    </div>
  );
}
