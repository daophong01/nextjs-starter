export const DESTINATIONS = [
  {
    slug: "bali",
    name: "Bali",
    description: "Thiên đường nhiệt đới với bãi biển xanh.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    rating: 4.8,
    price: 120,
    country: "Indonesia",
    tags: ["beach", "resort"]
  },
  {
    slug: "paris",
    name: "Paris",
    description: "Thành phố lãng mạn với tháp Eiffel.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    rating: 4.9,
    price: 300,
    country: "France",
    tags: ["city", "culture"]
  }
];

export const TOURS = [
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
      { day: 3, title: "Chợ Sa Pa - Trở về", details: "Mua sắm đặc sản, khởi hành về Hà Nội." }
    ]
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
      { day: 3, title: "Biển Mỹ Khê", details: "Tắm biển, thưởng thức hải sản." }
    ]
  }
];

export const POSTS = [
  {
    slug: "kinh-nghiem-du-lich-bali",
    title: "Kinh nghiệm du lịch Bali",
    excerpt: "Lịch trình, ẩm thực, nơi không thể bỏ lỡ.",
    content: "Bali là thiên đường nhiệt đới với bãi biển xanh và văn hóa đặc sắc...",
    author: "TravelGo",
    date: "2024-11-15T08:00:00.000Z",
    tags: ["kinh-nghiem", "bali", "bien"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
  }
];