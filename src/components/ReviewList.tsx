import RatingStars from "./RatingStars";

export type Review = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function ReviewList({ items }: { items: Review[] }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-foreground/60">Chưa có đánh giá.</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((r) => (
        <div
          key={r.id}
          className="p-4 rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{r.user}</div>
            <div className="text-xs text-foreground/60">
              {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="mt-1">
            <RatingStars rating={r.rating} />
          </div>
          <div className="text-sm mt-2">{r.comment}</div>
        </div>
      ))}
    </div>
  );
}