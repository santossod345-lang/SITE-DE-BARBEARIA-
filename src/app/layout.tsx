import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { siteConfig } from '@/lib/site-config'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Barbearia Luxo Dubai',
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-dubai-black text-white font-sans antialiased">
        <header className="border-b border-dubai-gold/20">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-3 items-center justify-between">
            <Link href="/" className="font-display text-2xl text-dubai-gold">
              {siteConfig.name}
            </Link>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
              <Link href="/" className="hover:text-dubai-gold transition-colors">Home</Link>
              <Link href="/servicos" className="hover:text-dubai-gold transition-colors">Serviços</Link>
              <Link href="/sobre" className="hover:text-dubai-gold transition-colors">Sobre</Link>
              <Link href="/contato" className="hover:text-dubai-gold transition-colors">Contato</Link>
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
          <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-400 text-center">
            © 2026 {siteConfig.name}. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  )
}
