# TravelGo (React + Node.js)

Kiến trúc đã được chuyển hoàn toàn sang:
- FE: React SPA + Tailwind CSS (không dùng Next/Vite)
- BE: Node.js (Express) + MySQL + Prisma

Thư mục chính:
- `client/` — React SPA, Tailwind CDN, React Router. Không cần build, BE sẽ phục vụ static.
- `server/` — Express API, JWT auth + refresh + CSRF (admin), rate-limit, audit log, uploads, SSR-light cho SEO cơ bản.
- `prisma/` — Prisma schema và migrations.
- `public/uploads/` — nơi lưu ảnh upload theo thư mục: `blog/`, `tours/`, `destinations/`, `avatars/`.

Đã xóa toàn bộ mã Next.js cũ (`src/app`, `src/components`, `src/lib`, `src/emails`, `src/data`, `next.config.ts`, `postcss.config.mjs`, `sentry.*.config.ts`, các file cấu hình và tests gắn với Next) để repo gọn sạch.

## Chạy Backend

1. `cd server`
2. `npm install`
3. Cấu hình `.env`:
   - `DATABASE_URL=mysql://user:pass@host:port/db`
   - `JWT_SECRET=your-strong-secret`
   - `ADMIN_EMAIL=admin@example.com`
   - `ADMIN_PASSWORD=admin123`
4. Prisma:
   - `npx prisma generate`
   - `npx prisma migrate dev`
5. Chạy:
   - `npm run dev` (http://localhost:4000)

API chính:
- Auth: `POST /api/auth/login` (trả `token`, `refreshToken`, `csrfToken`, `role`), `POST /api/auth/refresh`
- Destinations: `GET /api/destinations`, `GET /api/destinations/:slug`
- Admin Destinations: `GET/POST/PATCH/DELETE /api/admin/destinations` (Bearer + x-csrf-token)
- Tours: `GET /api/tours`, `GET /api/tours/:slug`
- Reviews: `GET /api/reviews` (lọc `slug` hoặc `email`), `POST /api/reviews`
- Bookings: `GET /api/bookings` (lọc `email`), `POST /api/bookings`
- Blog: `GET /api/blog/posts`, `GET/POST /api/blog/comments`, Admin: `GET/PATCH/DELETE /api/admin/comments`
- Contacts: `POST /api/contact`, Admin: `GET/PATCH/DELETE /api/admin/contacts`
- Uploads: `GET/POST /api/uploads` (multer, lưu vào `public/uploads/{folder}`)
- Coupons: `POST /api/coupons` (áp mã theo amount từng item)
- Health: `GET /api/health`
- SSR-light: `GET /` (home), `GET /blog` (list)

## Chạy Frontend

- BE tự phục vụ thư mục `client/` làm SPA:
  - Truy cập http://localhost:4000/
- Trang chính trong SPA:
  - `/` Home
  - `/destinations`, `/destinations/:slug`
  - `/tours`, `/tours/:slug`
  - `/deals` (chọn giảm `off`, nhập mã coupon áp theo từng item)
  - `/blog`, `/blog/:slug`
  - `/account` (lookup bookings/reviews theo email; khi login sẽ dùng token)
  - `/admin` (bảo vệ bằng JWT + CSRF; Destinations CRUD với upload ảnh)
  - `/contact`, `/about`
  - `/checkout` (đặt theo destination/tour)

## Upload ảnh

- Gửi `POST /api/uploads` (multipart/form-data):
  - `folder`: `blog|tours|destinations|avatars`
  - `file`: ảnh
- Ảnh được lưu tại `public/uploads/{folder}/{timestamp-filename}`, truy cập qua `/uploads/{folder}/{filename}`.

## CI (GitHub Actions)

- Workflow: `.github/workflows/server-ci.yml`
  - Cache `server/node_modules` và Prisma engines (`~/.cache/prisma`) để giảm thời gian cài đặt/generate.
  - Cài dependencies ở `server/`, chạy `npx prisma generate`.
  - Smoke test:
    - Khởi động server ở background với biến môi trường mẫu.
    - Chờ tối đa 15s cho server sẵn sàng.
    - `curl http://localhost:4000/api/health` kiểm tra phản hồi OK.
    - Kill tiến trình server.
  - Liệt kê `server/src` để xác nhận cấu trúc.

## Ghi chú

- Rate-limit hiện in-memory; khuyến nghị dùng Redis (Upstash) cho production.
- SSR-light giúp SEO cơ bản cho home/blog list; có thể mở rộng cho chi tiết bài/điểm đến.
- Deals: mã coupon áp chính xác theo từng item (percentage/fixed, có maxDiscountAmount).
- Admin có audit log tối giản ghi vào `admin.log`.

## Lệnh nhanh

- Backend dev: `cd server && npm run dev`
- Prisma: `npx prisma generate` • `npx prisma migrate dev`
- Health: `curl http://localhost:4000/api/health`
