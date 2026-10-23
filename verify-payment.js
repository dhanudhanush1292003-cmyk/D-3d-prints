const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body || "{}");
    if (!process.env.RAZORPAY_KEY_SECRET) return { statusCode: 503, body: JSON.stringify({ verified: false, error: "Payment verification is not configured." }) };
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { statusCode: 400, body: JSON.stringify({ verified: false, error: "Missing payment verification details." }) };
    }
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    const a = Buffer.from(expected, "hex"), b = Buffer.from(razorpay_signature, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return { statusCode: 400, body: JSON.stringify({ verified: false, error: "Payment signature could not be verified." }) };
    }
    // Production note: save verified orders to a database and reconcile payments via webhooks.
    return { statusCode: 200, body: JSON.stringify({ verified: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id }) };
  } catch (e) {
    console.error("verify-payment error", e.message);
    return { statusCode: 500, body: JSON.stringify({ verified: false, error: "Verification failed. Contact support before retrying payment." }) };
  }
};