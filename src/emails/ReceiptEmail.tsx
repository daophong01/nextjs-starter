import { Html, Head, Preview, Body, Container, Heading, Text, Section } from "@react-email/components";

export default function ReceiptEmail(props: {
  bookingId: string;
  name: string;
  total: number;
  paymentMethod?: string;
  paidAt?: string;
}) {
  const { bookingId, name, total, paymentMethod, paidAt } = props;
  return (
    <Html>
      <Head />
      <Preview>Biên nhận thanh toán #{bookingId}</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px" }}>
          <Heading style={{ marginBottom: "8px" }}>Biên nhận thanh toán</Heading>
          <Text>Xin chào {name},</Text>
          <Text>Đơn #{bookingId} đã thanh toán thành công.</Text>

          <Section>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ padding: "4px 8px" }}>Tổng tiền</td><td style={{ padding: "4px 8px" }}>${total}</td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Phương thức</td><td style={{ padding: "4px 8px" }}>{paymentMethod || "N/A"}</td></tr>
                <tr><td style={{ padding: "4px 8px" }}>Thời điểm</td><td style={{ padding: "4px 8px" }}>{paidAt || new Date().toLocaleString()}</td></tr>
              </tbody>
            </table>
          </Section>

          <Text style={{ marginTop: "12px" }}>Cảm ơn bạn đã tin tưởng TravelGo!</Text>
        </Container>
      </Body>
    </Html>
  );
}