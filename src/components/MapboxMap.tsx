"use client";
import { useEffect, useRef } from "react";

/**
 * Lightweight Mapbox embed using Static iframe.
 * Requires MAPBOX_ACCESS_TOKEN in env; otherwise use MapEmbed (Google) instead.
 */
export default function MapboxMap({ query }: { query: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    // no-op client logic; iframe handles rendering
  }, []);

  if (!token) {
    return null;
  }

  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11?fresh=true&title=false&zoomwheel=true#10.0/21.027/105.834`;

  // NOTE: For full interactivity you might integrate mapbox-gl. Here we keep a simple embed placeholder.
  return (
    <iframe
      ref={ref}
      title="Mapbox"
      src={`https://www.mapbox.com/embed?url=${encodeURIComponent(url)}&access_token=${token}`}
      className="w-full h-64 rounded border border-black/[.08] dark:border-white/[.145]"
    />
  );
}