import { Html, Head, Preview, Body, Container, Heading, Text, Link } from "@react-email/components";

export default function ResetPasswordEmail({ resetLink }: { resetLink: string }) {
  return (
    <Html>
      <Head />
      <Preview>Đặt lại mật khẩu</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px" }}>
          <Heading style={{ marginBottom: "8px" }}>Đặt lại mật khẩu</Heading>
          <Text>Nhấn vào liên kết sau để đặt lại mật khẩu (hiệu lực 1 giờ):</Text>
          <Link href={resetLink}>{resetLink}</Link>
          <Text style={{ marginTop: "12px" }}>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</Text>
        </Container>
      </Body>
    </Html>
  );
}