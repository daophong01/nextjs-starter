export type Tour = {
  slug: string;
  name: string;
  fromCity: string;
  destination: string;
  days: number;
  transport: "bus" | "flight" | "train" | "mixed";
  price: number;
  image: string;
  rating: number;
  highlights: string[];
  schedule: { day: number; title: string; details: string }[];
};

export const TOURS: Tour[] = [
  {
    slug: "ha-noi-sapa-3n2d",
    name: "Hà Nội - Sa Pa 3N2Đ",
    fromCity: "Hà Nội",
    destination: "Sa Pa",
    days: 3,
    transport: "bus",
    price: 199,
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop",
    rating: 4.7,
    highlights: ["Bản Cát Cát", "Đỉnh Fansipan", "Ẩm thực Tây Bắc"],
    schedule: [
      { day: 1, title: "Khởi hành - Bản Cát Cát", details: "Tham quan bản Cát Cát, check-in cảnh núi." },
      { day: 2, title: "Đỉnh Fansipan", details: "Cáp treo lên Fansipan, tự do khám phá." },
      { day: 3, title: "Chợ Sa Pa - Trở về", details: "Mua sắm đặc sản, khởi hành về Hà Nội." },
    ],
  },
  {
    slug: "da-nang-hoi-an-3n2d",
    name: "Đà Nẵng - Hội An 3N2Đ",
    fromCity: "Đà Nẵng",
    destination: "Hội An",
    days: 3,
    transport: "mixed",
    price: 249,
    image: "https://images.unsplash.com/photo-1526483360412-f4dbaf036963?q=80&w=1600&auto=format&fit=crop",
    rating: 4.8,
    highlights: ["Phố cổ Hội An", "Bà Nà Hills", "Biển Mỹ Khê"],
    schedule: [
      { day: 1, title: "Phố cổ Hội An", details: "Dạo phố, thả đèn hoa đăng." },
      { day: 2, title: "Bà Nà Hills", details: "Cầu Vàng, làng Pháp." },
      { day: 3, title: "Biển Mỹ Khê", details: "Tắm biển, thưởng thức hải sản." },
    ],
  },
  {
    slug: "paris-city-break-4n3d",
    name: "Paris City Break 4N3Đ",
    fromCity: "Paris",
    destination: "Paris",
    days: 4,
    transport: "train",
    price: 599,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    rating: 4.9,
    highlights: ["Tháp Eiffel", "Louvre", "Seine Cruise"],
    schedule: [
      { day: 1, title: "Tháp Eiffel", details: "Check-in và ngắm toàn cảnh thành phố." },
      { day: 2, title: "Bảo tàng Louvre", details: "Khám phá Mona Lisa và nghệ thuật." },
      { day: 3, title: "Du thuyền sông Seine", details: "Ngắm Paris về đêm." },
      { day: 4, title: "Tự do mua sắm", details: "Champs-Élysées." },
    ],
  },
];