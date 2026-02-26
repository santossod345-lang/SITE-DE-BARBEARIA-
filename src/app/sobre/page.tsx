import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Sobre | Barbearia do Alves',
  description: 'Conheça a história e proposta da Barbearia do Alves.',
};

export default function SobrePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Sobre Nós</h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
        Conheça a história e a missão por trás da {siteConfig.name}.
      </p>

      {/* História */}
      <div className="card mb-8 animate-slide-up">
        <h2 className="text-2xl font-display text-dubai-gold mb-4">Nossa História</h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            A {siteConfig.name} nasceu do sonho de criar um espaço onde homens pudessem cuidar
            da aparência com qualidade, conforto e profissionalismo. Fundada com a missão de
            oferecer cortes e barbas de alto padrão, a barbearia se tornou referência na região.
          </p>
          <p>
            Com Bruno e Paulo à frente do atendimento, cada cliente recebe uma experiência
            personalizada, combinando técnicas modernas com atenção aos detalhes que faz toda
            a diferença no resultado final.
          </p>
          <p>
            Nosso ambiente foi pensado para proporcionar conforto e sofisticação,
            desde a recepção até a poltrona. É mais que um corte — é uma experiência completa.
          </p>
        </div>
      </div>

      {/* Ambiente */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="card flex flex-col items-center text-center py-8 animate-fade-in">
          <span className="text-4xl mb-3">🪑</span>
          <h3 className="text-dubai-gold font-display text-lg mb-2">Ambiente Premium</h3>
          <p className="text-gray-400 text-sm">Espaço moderno e confortável para sua melhor experiência.</p>
        </div>
        <div className="card flex flex-col items-center text-center py-8 animate-fade-in">
          <span className="text-4xl mb-3">✂️</span>
          <h3 className="text-dubai-gold font-display text-lg mb-2">Equipamentos Top</h3>
          <p className="text-gray-400 text-sm">Ferramentas profissionais de última geração.</p>
        </div>
        <div className="card flex flex-col items-center text-center py-8 animate-fade-in">
          <span className="text-4xl mb-3">🎵</span>
          <h3 className="text-dubai-gold font-display text-lg mb-2">Clima Agradável</h3>
          <p className="text-gray-400 text-sm">Música, café e um ambiente descontraído.</p>
        </div>
      </div>

      {/* Missão e Valores */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-display text-dubai-gold mb-4">🎯 Missão</h2>
          <p className="text-gray-300 leading-relaxed">
            Oferecer serviços de barbearia de excelência, proporcionando uma experiência
            única de cuidado pessoal com profissionalismo, pontualidade e resultados
            que elevam a autoestima de cada cliente.
          </p>
        </div>
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-display text-dubai-gold mb-4">💎 Valores</h2>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-dubai-gold">•</span> Excelência em cada detalhe
            </li>
            <li className="flex items-center gap-2">
              <span className="text-dubai-gold">•</span> Respeito e atenção ao cliente
            </li>
            <li className="flex items-center gap-2">
              <span className="text-dubai-gold">•</span> Pontualidade e compromisso
            </li>
            <li className="flex items-center gap-2">
              <span className="text-dubai-gold">•</span> Inovação e aprendizado contínuo
            </li>
            <li className="flex items-center gap-2">
              <span className="text-dubai-gold">•</span> Ambiente acolhedor e inclusivo
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/profissionais" className="btn-primary inline-block">
          Conheça Nossos Profissionais
        </Link>
      </div>
    </div>
  );
}
