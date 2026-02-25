export default function LoadingCard({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-4 bg-zinc-800 rounded w-3/4 mb-3" />
          <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
          <div className="h-3 bg-zinc-800 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
