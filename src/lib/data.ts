export type Destination = {
  slug: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  priceFrom: number;
  description: string;
  highlights: string[];
};

export type Tour = {
  id: string;
  title: string;
  destinationSlug: string;
  durationDays: number;
  price: number;
  image: string;
  summary: string;
};

export const destinations: Destination[] = [
  {
    slug: "bali-indonesia",
    name: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    rating: 4.8,
    priceFrom: 499,
    description:
      "Bali is a tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.",
    highlights: ["Ubud Rice Terraces", "Tanah Lot Temple", "Uluwatu Cliffs"],
  },
  {
    slug: "paris-france",
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1471623432079-b009d30b6729?q=80&w=1600&auto=format&fit=crop",
    rating: 4.7,
    priceFrom: 699,
    description:
      "The city of lights, romance, and world-class cuisine. Explore art, architecture, and charming streets.",
    highlights: ["Eiffel Tower", "Louvre Museum", "Montmartre"],
  },
  {
    slug: "kyoto-japan",
    name: "Kyoto",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d4?q=80&w=1600&auto=format&fit=crop",
    rating: 4.9,
    priceFrom: 899,
    description:
      "Historic temples, traditional tea houses, and peaceful bamboo forests in Japan's cultural capital.",
    highlights: ["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Gion"],
  },
  {
    slug: "capetown-south-africa",
    name: "Cape Town",
    country: "South Africa",
    image:
      "https://images.unsplash.com/photo-1519680772-8b1b0b84aa0e?q=80&w=1600&auto=format&fit=crop",
    rating: 4.6,
    priceFrom: 799,
    description:
      "A stunning coastal city with dramatic landscapes, diverse culture, and vibrant waterfront.",
    highlights: ["Table Mountain", "Cape of Good Hope", "V&A Waterfront"],
  },
];

export const tours: Tour[] = [
  {
    id: "t1",
    title: "Bali Beaches and Temples",
    destinationSlug: "bali-indonesia",
    durationDays: 5,
    price: 799,
    image:
      "https://images.unsplash.com/photo-1494475673543-6a6a27143b22?q=80&w=1600&auto=format&fit=crop",
    summary:
      "Experience Bali's best beaches and spiritual temples on a curated 5-day tour.",
  },
  {
    id: "t2",
    title: "Romance in Paris",
    destinationSlug: "paris-france",
    durationDays: 4,
    price: 999,
    image:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?q=80&w=1600&auto=format&fit=crop",
    summary:
      "A romantic getaway exploring iconic Paris landmarks, food, and hidden gems.",
  },
  {
    id: "t3",
    title: "Kyoto Heritage Walk",
    destinationSlug: "kyoto-japan",
    durationDays: 3,
    price: 1099,
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d4?q=80&w=1600&auto=format&fit=crop",
    summary:
      "Immerse yourself in Kyoto's traditions, shrines, and serene gardens.",
  },
  {
    id: "t4",
    title: "Cape Town Adventure",
    destinationSlug: "capetown-south-africa",
    durationDays: 6,
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=1600&auto=format&fit=crop",
    summary:
      "Hike Table Mountain, enjoy coastal drives, and savor world-class cuisine.",
  },
];