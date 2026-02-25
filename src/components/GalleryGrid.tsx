'use client';

import { useState } from 'react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  barberName: string;
  description: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [filter, setFilter] = useState<string>('Todos');
  const barberNames = ['Todos', ...Array.from(new Set(items.map((item) => item.barberName)))];
  const filtered = filter === 'Todos' ? items : items.filter((item) => item.barberName === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {barberNames.map((name) => (
          <button
            key={name}
            onClick={() => setFilter(name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === name
                ? 'bg-dubai-gold text-dubai-black'
                : 'border border-dubai-gold/30 text-dubai-gold hover:bg-dubai-gold/10'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card group overflow-hidden animate-fade-in"
          >
            <div className="aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg mb-3 flex items-center justify-center">
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">✂️</span>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{item.description}</p>
              <span className="text-xs text-dubai-gold border border-dubai-gold/30 px-2 py-1 rounded-full">
                {item.barberName}
              </span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">Nenhum trabalho encontrado para este filtro.</p>
      )}
    </div>
  );
}
