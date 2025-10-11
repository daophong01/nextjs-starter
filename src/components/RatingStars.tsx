import React from "react";

export default function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  function Star({ fill = "none" }: { fill?: "none" | "full" | "half" }) {
    const color = fill === "full" ? "#f59e0b" : fill === "half" ? "url(#halfGradient)" : "none";
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill === "none" ? "none" : color}
        stroke="#f59e0b"
        strokeWidth="1.5"
        className="inline-block"
      >
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"
        />
        {fill !== "none" && <rect x="0" y="0" width="24" height="24" fill={color} mask="url(#mask)" />}
      </svg>
    );
  }

  return (
    <div className="flex items-center gap-1" aria-label={`Đánh giá ${rating.toFixed(1)} trên 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`full-${i}`} fill="full" />
      ))}
      {half && <Star fill="half" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`empty-${i}`} fill="none" />
      ))}
      <span className="text-xs text-foreground/70 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}