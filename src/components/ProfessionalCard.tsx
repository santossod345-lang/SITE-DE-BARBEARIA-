import StarRating from './StarRating';

interface ProfessionalCardProps {
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  imageInitial: string;
  whatsapp?: string;
}

export default function ProfessionalCard({
  name,
  role,
  bio,
  specialties,
  rating,
  reviewCount,
  imageInitial,
  whatsapp,
}: ProfessionalCardProps) {
  return (
    <article className="card animate-slide-up">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dubai-gold to-dubai-gold-dark flex items-center justify-center text-dubai-black text-3xl font-display font-bold mb-4">
          {imageInitial}
        </div>
        <h3 className="text-2xl font-display text-dubai-gold mb-1">{name}</h3>
        <p className="text-dubai-gold-light text-sm mb-3">{role}</p>
        <StarRating rating={rating} size="sm" showValue />
        <p className="text-gray-500 text-xs mb-4">{reviewCount} avaliações</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {specialties.map((s) => (
            <span key={s} className="text-xs border border-dubai-gold/30 text-dubai-gold px-3 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-2 px-6 text-sm"
          >
            WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
