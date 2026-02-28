'use client';

import { useState } from 'react';

interface ReviewFormProps {
  professionals: string[];
  appointmentId?: string;
  token?: string;
}

export default function ReviewForm({ professionals, appointmentId, token }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [barber, setBarber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !rating || !comment || !barber) return;
    if (!appointmentId || !token) {
      setError('Link de avaliação inválido. Use o link enviado pelo WhatsApp.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          token,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Não foi possível enviar sua avaliação.');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setRating(0);
        setComment('');
        setBarber('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Não foi possível enviar sua avaliação.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card text-center py-8 animate-fade-in">
        <span className="text-4xl mb-4 block">✅</span>
        <h3 className="text-dubai-gold text-xl font-display mb-2">Obrigado pela avaliação!</h3>
        <p className="text-gray-400">Sua opinião é muito importante para nós.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-xl font-display text-dubai-gold mb-2">Deixe sua avaliação</h3>
      {!!error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Seu nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-dubai"
          placeholder="Digite seu nome"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Profissional</label>
        <select
          value={barber}
          onChange={(e) => setBarber(e.target.value)}
          className="input-dubai"
          required
        >
          <option value="">Selecione o profissional</option>
          {professionals.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Avaliação</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className={`text-3xl transition-all duration-200 ${
                star <= (hoveredStar || rating) ? 'text-dubai-gold scale-110' : 'text-gray-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-1 block">Comentário</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input-dubai min-h-[100px]"
          placeholder="Conte como foi sua experiência..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={!name || !rating || !comment || !barber || loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}
