# TravelGo - Nền tảng du lịch thông minh

Tài liệu này phản ánh chính xác trạng thái code hiện tại và đánh dấu rõ phần đã triển khai và phần nằm trong lộ trình.

## Tổng quan

- Frontend: Next.js 15 (App Router) + React 19 + Tailwind v4
- Auth: NextAuth với Google/GitHub OAuth; đăng ký tài khoản đã tắt (chỉ đăng nhập)
- Backend: Route Handlers của Next.js (REST-ish)
- DB: Prisma + MySQL (đã chuyển), có seed dữ liệu mẫu
- Email: Resend (tùy chọn) với templates (verify/reset/booking)
- Payments: Stripe Checkout + webhook (đã có); các cổng khác nằm trong roadmap
- Admin: Bảng điều khiển với CRUD cho destinations, reviews, bookings
- Rate limiting: In-memory + tùy chọn Upstash Redis
- Monitoring: Tùy chọn Sentry

## Tính năng hiện có

- Trang chủ: hero, categories, featured, CTA, stories
- Destinations:
  - Danh sách: tìm kiếm, lọc (quốc gia, tags, giá, rating), sắp xếp, phân trang
  - Chi tiết: ảnh, mô tả, reviews, booking nhanh, SEO + JSON-LD
- Deals: trang ưu đãi -10% (frontend)
- Auth:
  - Đăng nhập Google/GitHub tại `/signin`
  - Credentials login (yêu cầu emailVerified); đăng ký đã tắt
  - Email verification (kích hoạt qua link) – dành cho trường hợp tạo sẵn user
  - Forgot/Reset password (token 1h)
- Booking:
  - Tạo booking ở `/checkout`
  - Stripe Checkout session + webhook cập nhật `paid`
  - Email xác nhận nếu cấu hình Resend
- Admin:
  - `/admin`: tổng quan
  - `/admin/destinations`: CRUD điểm đến
  - `/admin/reviews`: quản lý/xóa review
  - `/admin/bookings`: cập nhật trạng thái/xóa
- Rate limit:
  - POST reviews/bookings (10 req/phút/IP), có bản Upstash
- SPA React thuần (không Vite) song song:
  - `/spa/index.html` chạy bằng dữ liệu tĩnh `/spa/destinations.json`
  - Router client-side (hash) với pages Home/Destinations/Detail/Deals/Orders (localStorage)

## Roadmap (chưa triển khai)

- Chat: Live chat widget + admin panel, API `/api/chat`, `/api/chat/history`
- Coupon: Hệ thống mã giảm giá; áp dụng vào booking/checkout
- Thanh toán nội địa/quốc tế bổ sung: VNPay, MoMo, ZaloPay, PayPal
- Hóa đơn/Biên nhận: endpoints `/api/invoice`, `/api/receipt` + email/PDF
- SimpleAuth: hệ auth nhẹ song song với NextAuth (nếu cần)
- Tài khoản mở rộng: wishlist, loyalty, notifications, support, settings, avatar
- Analytics nâng cao: sử dụng `@vercel/analytics/react` (hiện đã gỡ import để tránh lỗi)

## Công nghệ

- Frontend: Next.js, React, Tailwind v4, Heroicons
- Backend: Next.js Route Handlers, Zod validation
- DB: Prisma + MySQL (Prisma schema trong `prisma/schema.prisma`)
- Email: Resend + React Email templates
- Payments: Stripe SDK
- Monitoring: Sentry (tùy chọn)
- Rate limit: In-memory hoặc Upstash Redis

## Chạy dự án (local)

1) `.env`
- Bắt buộc:
  - `DATABASE_URL="mysql://root:password123@localhost:3306/travelgo"`
  - `NEXTAUTH_URL="http://localhost:3000"`
  - `NEXTAUTH_SECRET="<chuỗi mạnh>"`
- OAuth:
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (hoặc biến cũ `GITHUB_ID`, `GITHUB_SECRET`)
- Tùy chọn: `RESEND_API_KEY`, `RESEND_FROM`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `UPSTASH_*`, `SENTRY_*`, `NEXT_PUBLIC_GA_ID`

2) MySQL
- Tạo DB `travelgo` và đảm bảo user có quyền.
- Ví dụ: `CREATE DATABASE travelgo; GRANT ALL ON travelgo.* TO 'root'@'localhost';`

3) Cài deps + migrate + seed
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init_mysql
npm run db:seed
```

4) Chạy dev
- Windows: `npm run dev:win`
- Khác: `npm run dev:open` hoặc `npm run dev`

5) Truy cập
- `/` – Trang chủ
- `/destinations`, `/destinations/[slug]`, `/deals`, `/checkout`
- `/signin` (Google/GitHub)
- `/account`, `/admin`, `/admin/destinations`, `/admin/reviews`, `/admin/bookings`
- SPA: `/spa/index.html` (frontend thuần)

## Scripts hữu ích

- Dev:
  - `npm run dev`, `npm run dev:open`, `npm run dev:win`
- Build/Start:
  - `npm run build`, `npm run start`, `npm run start:open`, `npm run start:win`
- Prisma:
  - `npm run db:generate`, `npm run db:migrate`, `npm run db:seed`
- Test:
  - `npm test`
- Stripe webhook:
  - `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Email domain (Resend) & DNS

1) Verify domain trên Resend (DKIM records).
2) SPF:
- TXT @ → `v=spf1 include:resend.com ~all`
3) DMARC:
- TXT `_dmarc` → `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100`
4) `.env`:
- `RESEND_API_KEY`, `RESEND_FROM="TravelGo <noreply@yourdomain.com>"`

## Cấu trúc thư mục nổi bật

- `src/app/layout.tsx`: Layout chung
- `src/app/page.tsx`: Trang chủ
- `src/app/destinations/page.tsx`: Danh sách
- `src/app/destinations/[slug]/page.tsx`: Chi tiết
- `src/app/deals/page.tsx`: Ưu đãi
- `src/app/checkout/page.tsx`: Checkout
- `src/app/admin/*`: Trang admin
- `src/app/api/*`: Destinations, reviews, bookings, checkout session, stripe webhook, admin, health
- `src/components/*`: NavBar, Footer, SearchBar, FiltersBar, SortBar, PaginationBar, DestinationCard, MapEmbed, ReviewsSection, Admin managers
- `src/lib/*`: prisma client, validation, rate limit (local + Upstash), auth options, email templates
- `prisma/schema.prisma`: Prisma schema (MySQL)
- `public/spa/*`: SPA React thuần
- `scripts/seed.mjs`: Seed dữ liệu mẫu

## Lưu ý

- GA4: đã nhúng Script; gỡ `@vercel/analytics/react` để tránh lỗi module not found.
- Đăng ký tài khoản: đã vô hiệu hóa; dùng Google/GitHub để đăng nhập.
- Ảnh: dùng Unsplash; sản xuất nên dùng CDN/bucket riêng.
- Bản đồ: Google Maps embed (demo); sản xuất nên dùng Google Maps Platform/Mapbox.
- Triển khai sản xuất: dùng MySQL managed (PlanetScale/Cloud SQL), Upstash Redis, Sentry, Resend, Stripe.

## Roadmap triển khai tiếp theo (nếu cần)

1) Coupon system + áp dụng vào booking
2) Chat real-time + admin chat panel
3) Hóa đơn/biên nhận (HTML/PDF) + endpoints
4) VNPay/MoMo/ZaloPay/PayPal integration
5) Account mở rộng: wishlist/loyalty/notifications/support/settings/avatar
6) Analytics nâng cao + bundle optimizations
