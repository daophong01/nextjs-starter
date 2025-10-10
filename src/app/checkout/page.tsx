import { DESTINATIONS } from "../../data/destinations";
import CheckoutForm from "../../components/CheckoutForm";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams?: { destination?: string; guests?: string; from?: string; to?: string };
}) {
  const destSlug = searchParams?.destination || "";
  const d = DESTINATIONS.find((x) => x.slug === destSlug);
  const guests = Math.max(1, Number(searchParams?.guests || 2));

  return (
    <main className="container">
      <h1 className="text-2xl sm:text-3xl font-bold mt-8">Xác nhận đặt chỗ</h1>

      <div className="mt-6">
        <CheckoutForm
          destinationSlug={d?.slug}
          destinationName={d?.name}
          basePrice={d?.price ?? 0}
          guests={guests}
          from={searchParams?.from}
          to={searchParams?.to}
        />
      </div>
    </main>
  );
}