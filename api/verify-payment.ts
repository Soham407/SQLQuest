import crypto from "crypto";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
interface MinimalRequest {
  method?: HttpMethod;
  body?: unknown;
}
interface MinimalResponse {
  status: (code: number) => MinimalResponse;
  json: (data: unknown) => void;
}


export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  interface VerifyBody {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = (req.body as VerifyBody) || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    res.status(500).json({ error: "Server misconfiguration: missing RAZORPAY_KEY_SECRET" });
    return;
  }

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    res.status(400).json({ valid: false, error: "Invalid signature" });
    return;
  }

  // TODO: update user subscription in your database here
  res.status(200).json({ valid: true });
}


