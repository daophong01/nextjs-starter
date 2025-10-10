import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  return (
    <main className="container">
      <ResetPasswordForm token={searchParams?.token} />
    </main>
  );
}