import { Html, Head, Preview, Body, Container, Heading, Text, Link } from "@react-email/components";

export default function VerifyEmail({ name, verifyLink }: { name?: string; verifyLink: string }) {
  return (
    <Html>
      <Head />
      <Preview>Xác thực email</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px" }}>
          <Heading style={{ marginBottom: "8px" }}>Xác thực email</Heading>
          <Text>Xin chào{ name ? ` ${name}` : "" },</Text>
          <Text>Nhấn vào liên kết sau để xác thực email của bạn (hiệu lực 24 giờ):</Text>
          <Link href={verifyLink}>{verifyLink}</Link>
          <Text style={{ marginTop: "12px" }}>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</Text>
        </Container>
      </Body>
    </Html>
  );
}