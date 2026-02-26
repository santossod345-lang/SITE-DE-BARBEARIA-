import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import StarRating from '@/components/StarRating';
import { fetchReviews, calculateAverageRating } from '@/services/api';

export default async function HomePage() {
  const reviews = await fetchReviews();
  const avgRating = calculateAverageRating(reviews);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dubai-gold/5 to-transparent" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="text-dubai-gold/80 text-sm uppercase tracking-widest mb-4 animate-fade-in">
            Estilo &amp; Precisão
          </p>
          <h1 className="font-display text-5xl sm:text-7xl text-dubai-gold mb-6 text-shadow-gold animate-slide-up">
            {siteConfig.name}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg mb-4 animate-fade-in">
            Experiência premium em barbearia com os melhores profissionais.
            Cortes modernos, barbas impecáveis e atendimento de alto padrão.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
            <StarRating rating={avgRating} size="md" showValue />
            <span className="text-gray-400 text-sm">({reviews.length} avaliações)</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary text-lg">
              ✂️ Agendar Agora
            </a>
            <Link href="/profissionais" className="btn-secondary text-lg">
              Conheça a Equipe
            </Link>
          </div>
        </div>
      </section>

      <div className="luxury-divider max-w-6xl mx-auto" />

      {/* Profissionais Destaque */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-10">Nossos Profissionais</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {siteConfig.professionals.map((pro) => {
            const proReviews = reviews.filter((r: any) => r.barberName === pro.name);
            const proRating = calculateAverageRating(proReviews);
            return (
              <article key={pro.name} className="card flex flex-col items-center text-center animate-slide-up">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-dark flex items-center justify-center text-dubai-black text-3xl font-display font-bold mb-4">
                  {pro.initial}
                </div>
                <h3 className="text-2xl font-display text-dubai-gold mb-1">{pro.name}</h3>
                <p className="text-dubai-gold-light text-sm mb-2">{pro.role}</p>
                <StarRating rating={proRating || 4.8} size="sm" showValue />
                <p className="text-gray-400 text-sm mt-3 max-w-sm">{pro.bio}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="luxury-divider max-w-6xl mx-auto" />

      {/* Serviços Destaque */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-10">Nossos Serviços</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="card">
            <h3 className="text-2xl text-dubai-gold font-display mb-2">Corte Premium</h3>
            <p className="text-gray-400">Acabamento de alto nível com técnica personalizada para o seu perfil.</p>
          </article>
          <article className="card">
            <h3 className="text-2xl text-dubai-gold font-display mb-2">Barba Completa</h3>
            <p className="text-gray-400">Modelagem, alinhamento e finalização para um visual impecável.</p>
          </article>
          <article className="card">
            <h3 className="text-2xl text-dubai-gold font-display mb-2">Experiência Completa</h3>
            <p className="text-gray-400">Pacote completo para quem busca presença e sofisticação.</p>
          </article>
        </div>
        <div className="text-center mt-8">
          <Link href="/servicos" className="btn-secondary inline-block">
            Ver Todos os Serviços
          </Link>
        </div>
      </section>

      <div className="luxury-divider max-w-6xl mx-auto" />

      {/* Avaliações Destaque */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="section-title text-center mb-10">O Que Dizem Nossos Clientes</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((review: any) => (
            <article key={review.id} className="card animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-dubai-gold font-semibold">{review.customerName}</h3>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-gray-400 text-sm">{review.comment}</p>
            </article>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/avaliacoes" className="btn-secondary inline-block">
            Ver Todas as Avaliações
          </Link>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-16 bg-gradient-to-b from-transparent to-dubai-gold/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-dubai-gold mb-4">
            Pronto para Transformar Seu Visual?
          </h2>
          <p className="text-gray-400 mb-8">
            Agende agora mesmo com um dos nossos profissionais e viva a experiência {siteConfig.name}.
          </p>
          <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary text-lg">
            ✂️ Agendar Agora
          </a>
        </div>
      </section>
    </div>
  );
}
