const Razorpay = require("razorpay");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { quantity, customer } = JSON.parse(event.body || "{}");
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) return { statusCode: 400, body: JSON.stringify({ error: "Choose 1–10 lamps." }) };
    if (!customer || !customer.name || !customer.phone || !customer.email || !customer.address || !/^\d{6}$/.test(customer.pincode)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Please enter valid delivery details." }) };
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return { statusCode: 503, body: JSON.stringify({ error: "Online payment is not activated yet. The store owner must add Razorpay API keys." }) };
    }
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const amount = qty * 99900 + 10000;
    const order = await razorpay.orders.create({
      amount, currency: "INR", receipt: `dd3d_${Date.now()}`,
      notes: {
        product: "Shiva Shadow Lamp", quantity: String(qty),
        customer_name: String(customer.name).slice(0, 80),
        customer_phone: String(customer.phone).slice(0, 20),
        customer_email: String(customer.email).slice(0, 120),
        shipping_address: String(customer.address).slice(0, 400),
        pincode: String(customer.pincode)
      }
    });
    return { statusCode: 200, body: JSON.stringify({ orderId: order.id, amount: order.amount, keyId: process.env.RAZORPAY_KEY_ID }) };
  } catch (e) {
    console.error("create-order error", e.message);
    return { statusCode: 500, body: JSON.stringify({ error: "Could not create payment order. Please try again later." }) };
  }
};