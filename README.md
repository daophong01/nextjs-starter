# TravelGo - Ứng dụng Web Du Lịch

Giao diện web du lịch đầy đủ tính năng, xây dựng bằng Next.js (App Router) + Tailwind CSS v4.

## Tính năng

- Trang chủ có hero, ưu đãi, thanh tìm kiếm, và điểm đến nổi bật.
- Danh sách điểm đến:
  - Tìm kiếm theo từ khóa (`q`), ngày đi/về (`from`, `to`).
  - Bộ lọc nâng cao: quốc gia (`country`), nhiều tag (`tags=beach,city`), giá tối thiểu/tối đa (`priceMin`, `priceMax`), rating tối thiểu (`ratingMin`).
  - Sắp xếp: giá tăng/giảm, rating cao → thấp, tên A → Z (`sort`).
  - Phân trang: `page`, `pageSize` (mặc định `pageSize=9`).
- Chi tiết điểm đến:
  - Ảnh minh họa, thông tin, đặt chỗ nhanh.
  - Bản đồ nhúng (Google Maps embed, không cần API key).
  - Đánh giá (hiển thị + thêm mới), lưu trên localStorage (trình duyệt).
  - SEO động: `generateMetadata` theo từng điểm đến (title/description/OpenGraph).
- Trang Checkout: tổng hợp thông tin và demo thanh toán.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở http://localhost:3000 để truy cập ứng dụng.

## Các đường dẫn quan trọng

- Trang chủ: `/`
- Danh sách điểm đến: `/destinations`
  - Ví dụ lọc: `/destinations?q=bien&country=Việt Nam&priceMin=50&priceMax=100&ratingMin=4.5&tags=beach,city`
  - Ví dụ sắp xếp: `/destinations?sort=price-asc`
  - Ví dụ phân trang: `/destinations?page=2&pageSize=9`
- Chi tiết điểm đến: `/destinations/ha-noi`, `/destinations/da-nang`, `/destinations/paris`, `/destinations/bali`, `/destinations/tokyo`
- Checkout: `/checkout` (hoặc đi từ form đặt chỗ nhanh trên trang chi tiết)

## Cấu trúc thư mục nổi bật

- `src/app/layout.tsx`: Layout chung (NavBar, Footer, metadata).
- `src/app/page.tsx`: Trang chủ.
- `src/app/destinations/page.tsx`: Danh sách + bộ lọc + sắp xếp + phân trang.
- `src/app/destinations/[slug]/page.tsx`: Chi tiết điểm đến (Map, Reviews, Booking nhanh, SEO động).
- `src/app/checkout/page.tsx`: Trang checkout.
- `src/components/*`: Các component UI (NavBar, Footer, SearchBar, FiltersBar, SortBar, PaginationBar, DestinationCard, MapEmbed, ReviewsSection).
- `src/data/*`: Dữ liệu mẫu (destinations, reviews).

## Lưu ý

- Ảnh sử dụng nguồn Unsplash (link trực tiếp). Trong sản xuất nên dùng CDN/bucket riêng.
- Bản đồ dùng Google Maps embed bằng query, phù hợp demo. Sản xuất nên dùng Google Maps Platform/Mapbox để có marker, đường đi, v.v.
- Reviews lưu trên `localStorage` theo từng điểm đến (không có backend).

## Mở rộng

- Kết nối API/DB để lưu đánh giá và đơn đặt chỗ.
- Thêm phân trang phía server, multi-filter nâng cao (khoảng giá trượt, nhiều quốc gia).
- Tối ưu SEO (structured data), sitemap, và analytics.
