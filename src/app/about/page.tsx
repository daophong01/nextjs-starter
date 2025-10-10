export default function AboutPage() {
  return (
    <main className="container">
      <section className="mt-10 sm:mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold">Giới thiệu TravelGo</h1>
        <p className="mt-3 text-foreground/80">
          TravelGo là nền tảng du lịch giúp bạn khám phá, lên kế hoạch và đặt chỗ cho những hành trình tuyệt vời,
          được xây dựng với công nghệ hiện đại và trải nghiệm người dùng trực quan.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="card p-4">
          <h2 className="font-semibold">Sứ mệnh</h2>
          <p className="text-sm/6 text-foreground/70 mt-1">
            Kết nối du khách với những trải nghiệm độc đáo trên khắp thế giới.
          </p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">Giá trị</h2>
          <p className="text-sm/6 text-foreground/70 mt-1">
            Minh bạch, an toàn, tiện lợi và hỗ trợ tận tâm 24/7.
          </p>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold">Công nghệ</h2>
          <p className="text-sm/6 text-foreground/70 mt-1">
            Next.js App Router, Tailwind CSS v4, API nhẹ, tối ưu SEO và hiệu năng.
          </p>
        </div>
      </section>
    </main>
  );
}