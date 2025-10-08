"use client";

import { useEffect, useState } from "react";
import { destinations, tours } from "@/lib/data";
import DestinationCard from "@/components/DestinationCard";
import TourCard from "@/components/TourCard";

function getList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function WishlistPage() {
  const [destIds, setDestIds] = useState<string[]>([]);
  const [tourIds, setTourIds] = useState<string[]>([]);

  useEffect(() => {
    setDestIds(getList("travelx_wishlist_destination"));
    setTourIds(getList("travelx_wishlist_tour"));
  }, []);

  const dests = destinations.filter((d) => destIds.includes(d.slug));
  const ts = tours.filter((t) => tourIds.includes(t.id));

  return (
    <div className="mt-8">
      <h1 className="text-2xl font-semibold">Danh sách yêu thích</h1>

      <div className="mt-6">
        <h2 className="text-lg font-medium">Điểm đến</h2>
        {dests.length === 0 ? (
          <div className="text-sm text-foreground/60 mt-2">Chưa có điểm đến yêu thích.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {dests.map((d) => (
              <DestinationCard key={d.slug} d={d} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium">Tour</h2>
        {ts.length === 0 ? (
          <div className="text-sm text-foreground/60 mt-2">Chưa có tour yêu thích.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {ts.map((t) => (
              <TourCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}