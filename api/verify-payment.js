/* ───────────────────────────────────────────────────
   api/verify-payment.js — Vercel Serverless Function
   Verifies Razorpay payment signature & creates order
   ─────────────────────────────────────────────────── */

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      cart,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification fields' });
    }

    // Verify signature using HMAC SHA256
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed — invalid signature' });
    }

    // Payment verified! Create order in Shopify via Admin API
    // In production, uncomment and configure:
    //
    // const shopifyOrder = await fetch(
    //   `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/orders.json`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_TOKEN,
    //     },
    //     body: JSON.stringify({
    //       order: {
    //         line_items: cart.map(item => ({
    //           title: item.name,
    //           quantity: item.qty,
    //           price: item.price.toString(),
    //           variant_id: item.variantId || undefined,
    //         })),
    //         customer: {
    //           first_name: customer.name.split(' ')[0],
    //           last_name: customer.name.split(' ').slice(1).join(' '),
    //           email: customer.email,
    //           phone: '+91' + customer.phone,
    //         },
    //         shipping_address: {
    //           first_name: customer.name.split(' ')[0],
    //           last_name: customer.name.split(' ').slice(1).join(' '),
    //           address1: customer.address1,
    //           address2: customer.address2,
    //           city: customer.city,
    //           province: customer.state,
    //           zip: customer.pincode,
    //           country: 'IN',
    //           phone: '+91' + customer.phone,
    //         },
    //         financial_status: 'paid',
    //         transactions: [{
    //           kind: 'sale',
    //           status: 'success',
    //           amount: cart.reduce((s, i) => s + i.price * i.qty, 0).toString(),
    //           gateway: 'razorpay',
    //         }],
    //         note: `Razorpay Payment ID: ${razorpay_payment_id}`,
    //       },
    //     }),
    //   }
    // );

    const orderId = 'ANISO-' + razorpay_payment_id.slice(-8).toUpperCase();

    return res.status(200).json({
      success: true,
      order_id: orderId,
      payment_id: razorpay_payment_id,
      message: 'Payment verified successfully',
    });
  } catch (err) {
    console.error('[verify-payment] Error:', err);
    return res.status(500).json({ error: 'Payment verification failed. Please contact support.' });
  }
};
