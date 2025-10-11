export default function ContactPage() {
  return (
    <div className="mt-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">Liên hệ</h1>
      <p className="text-sm text-foreground/70 mt-1">
        Gửi yêu cầu hoặc liên hệ đội ngũ hỗ trợ của chúng tôi.
      </p>

      <form className="mt-6 p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Họ và tên</label>
            <input className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none" placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input type="email" className="mt-1 w-full h-10 px-3 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none" placeholder="ban@vidu.com" />
          </div>
        </div>
        <div>
          <label className="text-sm">Nội dung</label>
          <textarea rows={5} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border border-black/10 dark:border-white/15 outline-none" placeholder="Mô tả yêu cầu của bạn..." />
        </div>
        <button type="button" className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
          Gửi liên hệ
        </button>
      </form>

      <div className="mt-6 text-sm">
        <div>Email: hello@travelx.example</div>
        <div>Hotline: 0123 456 789</div>
      </div>
    </div>
  );
}