import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Agendar | Barbearia Alves',
  description: 'Acesse o fluxo de agendamento da Barbearia Alves.',
};

export default function AgendarPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Agendamento</h1>
      <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Escolha o profissional e agende pelo ClientFlow para garantir disponibilidade em tempo real.
      </p>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-10">
        {siteConfig.professionals.map((pro) => (
          <div key={pro.name} className="card text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-dark flex items-center justify-center text-dubai-black text-2xl font-display font-bold mx-auto mb-4">
              {pro.initial}
            </div>
            <h2 className="text-xl font-display text-dubai-gold mb-1">{pro.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{pro.role}</p>
            <div className="flex flex-col gap-3">
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full text-center"
              >
                ✂️ Agendar com {pro.name}
              </a>
              <a
                href={`https://wa.me/${pro.whatsapp}?text=Olá! Gostaria de agendar um horário com ${pro.name}.`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full text-center"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="card text-center animate-fade-in">
        <h3 className="text-xl font-display text-dubai-gold mb-3">Como funciona?</h3>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-400">
          <div>
            <span className="text-3xl mb-2 block">1️⃣</span>
            <p>Escolha o profissional e clique em &quot;Agendar&quot;</p>
          </div>
          <div>
            <span className="text-3xl mb-2 block">2️⃣</span>
            <p>Selecione data, horário e serviço no ClientFlow</p>
          </div>
          <div>
            <span className="text-3xl mb-2 block">3️⃣</span>
            <p>Receba a confirmação e compareça no horário</p>
          </div>
        </div>
      </div>
    </div>
  );
}
