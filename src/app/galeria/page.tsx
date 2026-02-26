import type { Metadata } from 'next';
import { fetchGallery } from '@/services/api';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Galeria | Barbearia do Alves',
  description: 'Confira os trabalhos realizados pela equipe da Barbearia do Alves.',
};

export default async function GaleriaPage() {
  const gallery = await fetchGallery();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="section-title text-center">Galeria de Trabalhos</h1>
      <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Veja alguns dos trabalhos realizados pelos nossos profissionais.
        Filtre por barbeiro para ver os estilos de cada um.
      </p>

      <GalleryGrid items={gallery} />
    </div>
  );
}
