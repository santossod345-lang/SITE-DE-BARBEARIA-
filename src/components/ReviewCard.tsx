import StarRating from './StarRating';

interface ReviewCardProps {
  customerName: string;
  rating: number;
  comment: string;
  barberName?: string;
  createdAt?: string;
}

export default function ReviewCard({ customerName, rating, comment, barberName, createdAt }: ReviewCardProps) {
  return (
    <article className="card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-dubai-gold font-semibold">{customerName}</h3>
          {barberName && <p className="text-gray-500 text-xs">Profissional: {barberName}</p>}
        </div>
        <StarRating rating={rating} size="sm" />
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{comment}</p>
      {createdAt && (
        <p className="text-gray-600 text-xs mt-3">
          {new Date(createdAt).toLocaleDateString('pt-BR')}
        </p>
      )}
    </article>
  );
}
