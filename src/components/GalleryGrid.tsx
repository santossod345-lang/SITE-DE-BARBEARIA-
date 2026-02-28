'use client';

import Image from 'next/image';
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
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [imageAttemptMap, setImageAttemptMap] = useState<Record<string, number>>({});

  const barberNames = ['Todos', ...Array.from(new Set(items.map((item) => item.barberName)))];
  const filtered = filter === 'Todos' ? items : items.filter((item) => item.barberName === filter);
  const getImageCandidates = (imageUrl: string) => {
    if (!imageUrl) return [];

    const [path, queryString] = imageUrl.split('?');
    const query = queryString ? `?${queryString}` : '';
    const extensionMatch = path.match(/\.[^/.]+$/);
    const basePath = extensionMatch ? path.slice(0, -extensionMatch[0].length) : path;
    const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

    return Array.from(
      new Set([
        `${path}${query}`,
        ...extensions.map((ext) => `${basePath}${ext}${query}`),
      ]),
    );
  };

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
          <div key={item.id} className="card group overflow-hidden animate-fade-in">
            {(() => {
              const candidates = getImageCandidates(item.imageUrl);
              const attempt = imageAttemptMap[item.id] ?? 0;
              const safeAttempt = Math.min(attempt, Math.max(candidates.length - 1, 0));
              const src = candidates[safeAttempt];

              return (
            <div className="relative aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg mb-3 overflow-hidden">
              {!imageErrorMap[item.id] && item.imageUrl ? (
                <Image
                  src={src}
                  alt={item.description}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  onError={() => {
                    if (safeAttempt < candidates.length - 1) {
                      setImageAttemptMap((prev) => ({ ...prev, [item.id]: safeAttempt + 1 }));
                      return;
                    }
                    setImageErrorMap((prev) => ({ ...prev, [item.id]: true }));
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <span className="text-4xl mb-2 block">Corte</span>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </div>
                </div>
              )}
            </div>
              );
            })()}

            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-gray-400 truncate">{item.description}</p>
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
