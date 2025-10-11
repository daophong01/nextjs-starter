import { Html, Head, Preview, Body, Container, Heading, Text, Section } from "@react-email/components";

export default function BookingConfirmationEmail(props: {
  name: string;
  id: string;
  destination?: string;
  guests: number;
  from?: string;
  to?: string;
  price: number;
  status: string;
}) {
  const { name, id, destination, guests, from, to, price, status } = props;
  return (
    <Html>
      <Head />
      <Preview>Xác nhận đặt chỗ #{id}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px" }}>
          <Heading style={{ marginBottom: "8px" }}>Xác nhận đặt chỗ</Heading>
          <Text>Chào {name},</Text>
          <Text>Bạn đã đặt chỗ thành công. Mã đơn: <b>{id}</b>.</Text>

          <Section>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ padding: "4px 8px" }}>Điểm đến</td><td style={{ padding: "4px 8px" }}><b>{destination || "N/A"}</b></td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Khách</td><td style={{ padding: "4px 8px" }}><b>{guests}</b></td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Thời gian</td><td style={{ padding: "4px 8px" }}>{from || "-"} → {to || "-"}</td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Tổng</td><td style={{ padding: "4px 8px" }}><b>${price}</b></td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Trạng thái</td><td style={{ padding: "4px 8px" }}>{status}</td></tr>
              </tbody>
            </table>
          </Section>

          <Text style={{ marginTop: "12px" }}>Cảm ơn bạn đã tin tưởng TravelGo!</Text>
        </Container>
      </Body>
    </Html>
  );
}