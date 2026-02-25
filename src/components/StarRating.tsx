'use client';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function StarRating({ rating, maxStars = 5, size = 'md', showValue = false }: StarRatingProps) {
  const sizeClass = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' }[size];
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span key={i} className={`${sizeClass} ${filled ? 'text-dubai-gold' : half ? 'text-dubai-gold/50' : 'text-gray-600'}`}>
            ★
          </span>
        );
      })}
      {showValue && (
        <span className="ml-2 text-gray-300 text-sm">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
