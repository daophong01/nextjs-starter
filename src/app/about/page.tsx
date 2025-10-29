export default function AboutPage() {
  const milestones = [
    { year: "2023", title: "Khởi đầu", desc: "Ra mắt phiên bản thử nghiệm với danh sách điểm đến cơ bản." },
    { year: "2024", title: "Tăng trưởng", desc: "Bổ sung đặt chỗ trực tuyến, đánh giá, và ưu đãi." },
    { year: "2025", title: "Mở rộng", desc: "Tích hợp thanh toán quốc tế/nội địa và quản trị nội dung." },
  ];
  const team = [
    { name: "Anh Dũng", role: "Kỹ thuật", bio: "Xây dựng nền tảng, hiệu năng và bảo mật." },
    { name: "Minh Thư", role: "Sản phẩm", bio: "Trải nghiệm người dùng và hành trình khách hàng." },
    { name: "Quang Huy", role: "Hỗ trợ", bio: "Chăm sóc khách hàng 24/7, phản hồi nhanh." },
  ];

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

      <section className="mt-10 grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <div className="card p-4">
          <h2 className="font-semibold mb-2">Cột mốc phát triển</h2>
          <div className="grid gap-3">
            {milestones.map((m) => (
              <div key={m.year} className="flex items-start gap-3">
                <span className="inline-block rounded bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-xs/6 font-mono">
                  {m.year}
                </span>
                <div>
                  <div className="font-medium">{m.title}</div>
                  <div className="text-sm/6 text-foreground/70">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="card p-4 h-max">
          <h2 className="font-semibold mb-2">Đội ngũ</h2>
          <div className="grid gap-3">
            {team.map((t) => (
              <div key={t.name}>
                <div className="font-medium">{t.name} — {t.role}</div>
                <div className="text-sm/6 text-foreground/70">{t.bio}</div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}