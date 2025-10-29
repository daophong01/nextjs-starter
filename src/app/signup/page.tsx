export default function SignUpPage() {
  return (
    <main className="container">
      <div className="mt-16 max-w-md mx-auto card p-6 animate-soft-pop text-center">
        <h1 className="text-2xl font-bold">Đăng ký đã tắt</h1>
        <p className="text-sm/6 text-foreground/70 mt-2">
          Hiện tại hệ thống không mở đăng ký tài khoản mới. Vui lòng sử dụng tính năng đăng nhập Google/GitHub tại{" "}
          <a href="/signin" className="underline">trang đăng nhập</a>.
        </p>
      </div>
    </main>
  );
}