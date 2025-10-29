export default function LoadingDestinations() {
  const cells = Array.from({ length: 9 });
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mt-8 h-6 w-48 rounded bg-black/[.06] dark:bg-white/[.08]" />
      <div className="mt-4 grid gap-3">
        <div className="h-10 rounded bg-black/[.06] dark:bg-white/[.08]" />
        <div className="h-8 rounded bg-black/[.06] dark:bg-white/[.08]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {cells.map((_, i) => (
          <div key={i} className="rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden">
            <div className="h-48 w-full bg-black/[.06] dark:bg-white/[.08]" />
            <div className="p-4 grid gap-2">
              <div className="h-4 w-2/3 rounded bg-black/[.06] dark:bg-white/[.08]" />
              <div className="h-3 w-full rounded bg-black/[.06] dark:bg-white/[.08]" />
              <div className="h-3 w-1/2 rounded bg-black/[.06] dark:bg-white/[.08]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}