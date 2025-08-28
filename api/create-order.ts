
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

interface MinimalRequest {
  method?: HttpMethod;
  body?: unknown;
}

interface MinimalResponse {
  status: (code: number) => MinimalResponse;
  json: (data: unknown) => void;
}

const PLAN_TO_AMOUNT_IN_PAISE: Record<string, number> = {
  Free: 0,
  Pro: 2999,
  "Pro Plus": 4999,
};

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { planName } = (req.body as { planName?: string }) || {};
  if (!planName || !(planName in PLAN_TO_AMOUNT_IN_PAISE)) {
    res.status(400).json({ error: "Invalid plan" });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(500).json({ error: "Server misconfiguration: missing Razorpay credentials" });
    return;
  }

  const amount = PLAN_TO_AMOUNT_IN_PAISE[planName];

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response: Response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { planName },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: "Failed to create order", details: text });
      return;
    }

    const order = await response.json();
    
    // Also send the keyId to the frontend
    res.status(200).json({ ...order, keyId });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Unexpected error creating order", details: message });
  }
}


