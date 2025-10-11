# TravelGo - Ứng dụng Web Du Lịch

TravelGo là ứng dụng web du lịch đầy đủ chức năng, xây dựng bằng Next.js (App Router) + Tailwind CSS v4, có backend với Prisma, Auth, Payments, Email, Admin và Rate-limit.

## Tính năng giao diện

- Trang chủ: hero, ưu đãi, thống kê nhanh, thanh tìm kiếm, điểm đến nổi bật.
- Danh sách điểm đến:
  - Tìm kiếm (`q`), ngày đi/về (`from`, `to`).
  - Bộ lọc: quốc gia (multi), tags (multi), giá tối thiểu/tối đa, rating tối thiểu.
  - Sắp xếp: giá tăng/giảm, rating cao → thấp, tên A → Z.
  - Phân trang phía server: `page`, `pageSize` (mặc định 9).
- Chi tiết điểm đến:
  - Ảnh, thông tin, đặt chỗ nhanh, bản đồ nhúng (Google Maps embed), đánh giá.
  - SEO động (generateMetadata) + Structured Data (JSON-LD).
- Trang Ưu đãi `/deals`: tập hợp điểm đến đang giảm giá (-10%).
- Trang Giới thiệu `/about`, Liên hệ `/contact`, 404 `/not-found`.
- NavBar/Footer dùng Heroicons; UI có hiệu ứng, card, button thống nhất.

## Backend và Quản trị

- CSDL/ORM: Prisma + SQLite (có thể dùng Postgres).
- Auth: NextAuth (GitHub OAuth), phân quyền `role=admin`.
- API chính:
  - `GET /api/destinations` (lọc/sắp xếp/phân trang từ DB).
  - `GET/POST /api/reviews` (Prisma + zod).
  - `GET/POST /api/bookings` (Prisma + zod, gửi email xác nhận nếu cấu hình Resend).
  - `POST /api/checkout/session` (tạo Stripe Checkout Session).
  - `POST /api/stripe/webhook` (update trạng thái đơn về `paid`).
- Admin (chỉ admin):
  - `/admin` tổng quan.
  - `/admin/destinations` CRUD điểm đến.
  - `/admin/reviews` quản lý/xóa đánh giá.
  - `/admin/bookings` quản lý đơn, cập nhật trạng thái, xóa.
- Rate limiting:
  - In-memory token bucket (10 req/phút/IP) cho POST reviews/bookings.
  - Tùy chọn Upstash Redis (phân tán) nếu cấu hình `UPSTASH_*`.
- Monitoring (tuỳ chọn): Sentry (`@sentry/nextjs`) nếu cấu hình `SENTRY_DSN`.

## Công nghệ

- Frontend: Next.js App Router, Tailwind v4, Heroicons.
- Backend: Prisma ORM, NextAuth, Stripe, Resend, (tuỳ chọn) Upstash Redis, Sentry.
- Dữ liệu mẫu: `src/data/*`, seed script để đưa vào DB.

## Chạy dự án (local)

1) Tạo file `.env` từ `.env.example` và điền:
   - Bắt buộc: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `DATABASE_URL`.
   - Tuỳ chọn: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SENTRY_DSN`, `SENTRY_ENV`.
2) Chuẩn bị Postgres (không dùng Docker):
   - Cài Postgres trên máy hoặc dùng dịch vụ cloud (Neon/Supabase/Railway).
   - Tạo database (ví dụ: `travelgo`) và user có quyền.
   - Cập nhật `DATABASE_URL` trong `.env` cho khớp kết nối.
3) Cài deps và migrate:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   ```
4) Chạy dev:
   ```bash
   npm run dev
   ```
5) Đăng nhập GitHub tại `/api/auth/signin`, mở Prisma Studio (`npx prisma studio`) để set role=admin cho tài khoản.
6) Truy cập:
   - Trang chủ: `/`
   - Điểm đến: `/destinations`
   - Ưu đãi: `/deals`
   - Checkout: `/checkout`
   - Admin: `/admin`, `/admin/destinations`, `/admin/reviews`, `/admin/bookings`

## Lệnh chạy nhanh

- Dev:
  ```bash
  npm run dev
  ```
- Build + chạy production:
  ```bash
  npm run build
  npm run start
  ```
- Lint:
  ```bash
  npm run lint
  ```
- Prisma:
  ```bash
  npx prisma generate
  npx prisma migrate dev --name init
  npx prisma studio
  ```
- Seed dữ liệu:
  ```bash
  npm run db:seed
  ```
- Stripe webhook (dev):
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```
- Đồng bộ cosine.sh:
  ```bash
  npm run sync:cosine
  ```

## Scripts hữu ích

- Seed dữ liệu: `npm run db:seed`
- Sync nội dung cosine.sh:
  - `npm run sync:cosine` → lưu HTML vào `public/cosine.html`
  - GitHub Actions lịch hằng ngày: `.github/workflows/sync-cosine.yml`

## Cấu trúc thư mục nổi bật

- `src/app/layout.tsx`: Layout chung (NavBar, Footer, metadata).
- `src/app/page.tsx`: Trang chủ.
- `src/app/destinations/page.tsx`: Danh sách + lọc + sắp xếp + phân trang.
- `src/app/destinations/[slug]/page.tsx`: Chi tiết (Map, Reviews, Booking nhanh, SEO + JSON-LD).
- `src/app/deals/page.tsx`: Ưu đãi.
- `src/app/checkout/page.tsx`: Checkout (lưu booking + Stripe).
- `src/app/admin/*`: Trang admin (destinations/reviews/bookings).
- `src/app/api/*`: API (destinations, reviews, bookings, checkout session, stripe webhook, admin).
- `src/components/*`: NavBar, Footer, SearchBar, FiltersBar, SortBar, PaginationBar, DestinationCard, MapEmbed, ReviewsSection, Admin managers.
- `src/lib/*`: prisma client, validation (zod), rateLimit (local + Upstash).
- `prisma/schema.prisma`: Schema DB (User/Destination/Review/Booking + NextAuth models).
- `scripts/seed.mjs`: Seed dữ liệu mẫu vào DB.

## Email domain thật (Resend) và DNS

Để email không vào spam, cần xác thực domain gửi email và cài đặt đúng SPF/DKIM/DMARC.

1) Xác thực domain trên Resend
- Tạo tài khoản tại https://resend.com → Domains → Add domain (ví dụ: travelgo.yourdomain.com hoặc yourdomain.com).
- Resend cung cấp bản ghi DNS (TXT/CNAME) cho DKIM. Hãy thêm các bản ghi này vào DNS của domain bạn (Cloudflare/Route53/Namecheap...).
- Sau khi DNS propagated, domain sẽ ở trạng thái Verified.

2) Thiết lập SPF
- Thêm/ghi đè bản ghi TXT cho SPF (nếu chưa có):
  - Name/Host: @
  - Value: v=spf1 include:resend.com ~all
- Nếu đã có SPF, hãy thêm include:resend.com vào giá trị hiện tại.

3) Thiết lập DKIM (từ Resend)
- Thêm các CNAME/TXT theo hướng dẫn trên trang Domain của Resend (mỗi domain có keys riêng).
- Chờ xác thực thành công.

4) Thiết lập DMARC
- Bản ghi TXT:
  - Name: _dmarc
  - Value ví dụ: v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; ruf=mailto:dmarc@yourdomain.com; pct=100
- Bạn có thể dùng p=reject để nghiêm ngặt hơn sau khi kiểm tra hoạt động ổn định.

5) Cấu hình ứng dụng
- Điền `RESEND_API_KEY` và `RESEND_FROM` trong `.env`:
  ```env
  RESEND_API_KEY="re_..."
  RESEND_FROM="TravelGo <noreply@yourdomain.com>"
  ```
- Ứng dụng đã dùng `RESEND_FROM` cho tất cả email trong API:
  - Đăng ký: gửi email xác thực
  - Quên mật khẩu: gửi liên kết đặt lại
  - Đặt chỗ: gửi xác nhận đơn

6) Kiểm tra
- Dùng https://www.mail-tester.com/ để gửi thử và kiểm tra điểm spam.
- Kiểm tra mục Domain trên Resend có trạng thái “Verified”.

## Lưu ý

- Ảnh dùng link Unsplash. Sản xuất nên dùng CDN/bucket riêng.
- Bản đồ dùng Google Maps embed không cần key (demo). Sản xuất nên dùng Google Maps Platform/Mapbox.
- Khi deploy sản xuất, khuyến nghị dùng Postgres (Neon/Supabase/Railway), Upstash Redis và Sentry để đảm bảo độ bền, rate-limit và giám sát.
