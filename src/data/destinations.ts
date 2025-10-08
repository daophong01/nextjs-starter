export type Destination = {
  slug: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  price: number;
  country: string;
  tags: string[];
};

export const DESTINATIONS: Destination[] = [
  {
    slug: "ha-noi",
    name: "Hà Nội",
    description: "Thủ đô nghìn năm văn hiến với phố cổ, ẩm thực phong phú và hồ Hoàn Kiếm thơ mộng.",
    image: "https://images.unsplash.com/photo-1557734862-9e63f8a5b651?q=80&w=1600&auto=format&fit=crop",
    rating: 4.7,
    price: 89,
    country: "Việt Nam",
    tags: ["city", "culture", "food"]
  },
  {
    slug: "da-nang",
    name: "Đà Nẵng",
    description: "Thành phố đáng sống bên biển với Bà Nà Hills, Ngũ Hành Sơn và những bãi biển tuyệt đẹp.",
    image: "https://images.unsplash.com/photo-1608071591259-5b05d43acbbe?q=80&w=1600&auto=format&fit=crop",
    rating: 4.6,
    price: 79,
    country: "Việt Nam",
    tags: ["beach", "nature", "city"]
  },
  {
    slug: "paris",
    name: "Paris",
    description: "Kinh đô ánh sáng với tháp Eiffel, bảo tàng Louvre và những quán cà phê ven đường.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
    rating: 4.8,
    price: 199,
    country: "Pháp",
    tags: ["romantic", "city", "museum"]
  },
  {
    slug: "bali",
    name: "Bali",
    description: "Thiên đường nhiệt đới của Indonesia, nổi tiếng với ruộng bậc thang, đền cổ và bãi biển.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
    rating: 4.9,
    price: 159,
    country: "Indonesia",
    tags: ["beach", "resort", "nature"]
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    description: "Thành phố hiện đại bậc nhất, giao thoa giữa truyền thống và công nghệ.",
    image: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop",
    rating: 4.7,
    price: 229,
    country: "Nhật Bản",
    tags: ["city", "tech", "food"]
  }
];