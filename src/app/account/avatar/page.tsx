import Link from "next/link";

export const metadata = {
  title: "Ảnh đại diện - TravelGo",
  description: "Cập nhật ảnh đại diện.",
};

export default function AccountAvatarPage() {
  return (
    <main className="container">
      <section className="mt-8">
        <h1 className="text-2xl font-bold">Ảnh đại diện</h1>
        <div className="card p-6 mt-6">
          <p className="text-sm/6 text-foreground/70">
            Bạn có thể dùng Gravatar theo email hiện tại. Tính năng upload trực tiếp (S3/presigned URL) sẽ được thêm sớm.
          </p>
          <Link href="/account/profile" className="btn mt-3">Về Hồ sơ</Link>
        </div>
      </section>
    </main>
  );
}