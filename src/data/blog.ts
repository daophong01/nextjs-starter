export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // ISO
  tags: string[];
  image: string;
};

export const POSTS: BlogPost[] = [
  {
    slug: "kinh-nghiem-du-lich-bali",
    title: "Kinh nghiệm du lịch Bali: ăn gì, chơi gì, đi như thế nào?",
    excerpt:
      "Chia sẻ kinh nghiệm thực tế khi du lịch Bali: lịch trình, ẩm thực địa phương và những nơi không thể bỏ lỡ.",
    content:
      "Bali là thiên đường nhiệt đới với bãi biển xanh, đền cổ và văn hóa đặc sắc. Bạn có thể bắt đầu lịch trình từ Ubud để trải nghiệm ruộng bậc thang, sau đó di chuyển tới Uluwatu và Tanah Lot để ngắm hoàng hôn. Ẩm thực: thử nasi goreng, sate và các món hải sản. Di chuyển nội địa bằng taxi/Grab, thuê xe máy hoặc đặt tour trong ngày.\n\nMẹo nhỏ: đi vào mùa khô (tháng 4–9), chuẩn bị đổi tiền Rupiah và mua sim 4G ngay tại sân bay.",
    author: "TravelGo",
    date: "2024-11-15T08:00:00.000Z",
    tags: ["kinh-nghiem", "bali", "bien"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "review-paris-4n3d",
    title: "Review Paris 4N3Đ: lịch trình city break ngắn ngày",
    excerpt:
      "Tháp Eiffel, Louvre, sông Seine và những quán cà phê nhỏ ven đường – một chuyến city break hoàn hảo.",
    content:
      "Ngày 1: Check-in tháp Eiffel, dạo quanh Trocadéro. Ngày 2: Louvre – dành ít nhất nửa ngày, sau đó tản bộ dọc Rue de Rivoli. Ngày 3: Du thuyền sông Seine về đêm. Ngày 4: Mua sắm ở Champs-Élysées.\n\nVé tham quan nên mua trước online để tránh xếp hàng. Khí hậu thu/đông lạnh, cần áo ấm và giày đi bộ tốt.",
    author: "TravelGo",
    date: "2024-12-03T08:00:00.000Z",
    tags: ["review", "paris", "city"],
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "meo-du-lich-tokyo",
    title: "Mẹo du lịch Tokyo: di chuyển bằng tàu, ăn uống và văn hóa",
    excerpt:
      "Hệ thống tàu tiện lợi, đồ ăn phong phú và nét văn hóa đặc trưng – Tokyo là trải nghiệm không thể bỏ qua.",
    content:
      "Di chuyển: dùng thẻ Suica/Pasmo, tải ứng dụng tra tuyến tàu. Ăn uống: ramen, sushi, tempura, street food ở Shibuya/Asakusa. Văn hóa: tôn trọng không gian công cộng, xếp hàng trật tự.\n\nMẹo: mua pocket wifi hoặc eSIM, đổi JR Pass nếu đi nhiều thành phố.",
    author: "TravelGo",
    date: "2024-12-10T08:00:00.000Z",
    tags: ["meo", "tokyo", "city"],
    image:
      "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1600&auto=format&fit=crop",
  },
];