import { Html, Head, Preview, Body, Container, Heading, Text, Section } from "@react-email/components";

export default function InvoiceEmail(props: {
  bookingId: string;
  name: string;
  destination?: string;
  guests: number;
  from?: string;
  to?: string;
  subtotal: number;
  discount: number;
  serviceFee: number;
  tax: number;
  total: number;
  createdAt?: string;
}) {
  const { bookingId, name, destination, guests, from, to, subtotal, discount, serviceFee, tax, total, createdAt } = props;
  return (
    <Html>
      <Head />
      <Preview>Hóa đơn đặt chỗ #{bookingId}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px" }}>
          <Heading style={{ marginBottom: "8px" }}>Hóa đơn đặt chỗ</Heading>
          <Text>Xin chào {name},</Text>
          <Text>Mã đơn: <b>{bookingId}</b> (tạo lúc {createdAt || new Date().toLocaleString()}).</Text>

          <Section>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ padding: "4px 8px" }}>Điểm đến</td><td style={{ padding: "4px 8px" }}><b>{destination || "N/A"}</b></td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Khách</td><td style={{ padding: "4px 8px" }}><b>{guests}</b></td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Thời gian</td><td style={{ padding: "4px 8px" }}>{from || "-"} → {to || "-"}</td></tr>
              </tbody>
            </table>
          </Section>

          <Section>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ padding: "4px 8px" }}>Subtotal</td><td style={{ padding: "4px 8px" }}>${subtotal}</td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Giảm giá</td><td style={{ padding: "4px 8px" }}>-${discount}</td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Phí dịch vụ</td><td style={{ padding: "4px 8px" }}>${serviceFee}</td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Thuế</td><td style={{ padding: "4px 8px" }}>${tax}</td></tr>
                <tr><td style={{ padding: "4px 8px", fontWeight: 600 }}>Tổng</td><td style={{ padding: "4px 8px", fontWeight: 600 }}>${total}</td></tr>
              </tbody>
            </table>
          </Section>

          <Text style={{ marginTop: "12px" }}>Cảm ơn bạn đã tin tưởng TravelGo!</Text>
        </Container>
      </Body>
    </Html>
  );
}