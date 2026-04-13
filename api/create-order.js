/* ───────────────────────────────────────────────────
   api/create-order.js — Vercel Serverless Function
   Creates a Razorpay order or records a COD order
   ─────────────────────────────────────────────────── */

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { customer, cart, total, payment_method } = req.body;

    // Basic validation
    if (!customer || !cart || !cart.length || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (payment_method === 'cod') {
      // COD: no Razorpay order needed
      // In production, create a Shopify draft order here via Admin API
      const orderId = 'ANISO-COD-' + Date.now();
      return res.status(200).json({
        success: true,
        order_id: orderId,
        payment_method: 'cod',
      });
    }

    // Online payment: create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(total * 100), // amount in paise
      currency: 'INR',
      receipt: 'aniso_' + Date.now(),
      notes: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_city: customer.city,
        shipping_pincode: customer.pincode,
        items_count: cart.length.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('[create-order] Error:', err);
    return res.status(500).json({ error: 'Failed to create order. Please try again.' });
  }
};
