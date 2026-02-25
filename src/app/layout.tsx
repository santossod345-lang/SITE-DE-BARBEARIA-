import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Barbearia do Alves',
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-dubai-black text-white font-sans antialiased">
        <header className="border-b border-dubai-gold/20 sticky top-0 z-50 bg-dubai-black/95 backdrop-blur-sm">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
            <Link href="/" className="font-display text-2xl text-dubai-gold">
              {siteConfig.name}
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
              <Link href="/" className="hover:text-dubai-gold transition-colors">Home</Link>
              <Link href="/sobre" className="hover:text-dubai-gold transition-colors">Sobre</Link>
              <Link href="/profissionais" className="hover:text-dubai-gold transition-colors">Profissionais</Link>
              <Link href="/servicos" className="hover:text-dubai-gold transition-colors">Serviços</Link>
              <Link href="/galeria" className="hover:text-dubai-gold transition-colors">Galeria</Link>
              <Link href="/avaliacoes" className="hover:text-dubai-gold transition-colors">Avaliações</Link>
              <Link href="/localizacao" className="hover:text-dubai-gold transition-colors">Localização</Link>
              <a
                href={siteConfig.bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-2 px-4"
              >
                Agendar Agora
              </a>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-dubai-gold/20 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid gap-8 md:grid-cols-3 text-sm text-gray-400">
              <div>
                <h4 className="text-dubai-gold font-display text-lg mb-3">{siteConfig.name}</h4>
                <p className="leading-relaxed">{siteConfig.description}</p>
              </div>
              <div>
                <h4 className="text-dubai-gold font-display text-lg mb-3">Links</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/sobre" className="hover:text-dubai-gold transition-colors">Sobre</Link>
                  <Link href="/profissionais" className="hover:text-dubai-gold transition-colors">Profissionais</Link>
                  <Link href="/servicos" className="hover:text-dubai-gold transition-colors">Serviços</Link>
                  <Link href="/avaliacoes" className="hover:text-dubai-gold transition-colors">Avaliações</Link>
                </div>
              </div>
              <div>
                <h4 className="text-dubai-gold font-display text-lg mb-3">Contato</h4>
                <div className="flex flex-col gap-2">
                  <p>{siteConfig.address}</p>
                  <p>{siteConfig.phone}</p>
                  <p>{siteConfig.hours}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-dubai-gold/10 mt-8 pt-6 text-center text-xs text-gray-500">
              © 2026 {siteConfig.name}. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
