/* ───────────────────────────────────────────────────
   checkout.js — Checkout flow + Razorpay integration
   ─────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────
  // Replace with your Razorpay key_id (test or live)
  const RAZORPAY_KEY_ID = 'rzp_test_XXXXXXXXXXXX';
  const API_BASE = '/api'; // Vercel serverless functions

  // ── Render order summary on load ───────────────

  function renderCheckoutSummary() {
    const cart = getCart();
    const itemsEl = document.getElementById('ck-items');
    const subtotalEl = document.getElementById('ck-subtotal');
    const shippingEl = document.getElementById('ck-shipping');
    const totalEl = document.getElementById('ck-total');

    if (!itemsEl) return;

    if (!cart.length) {
      itemsEl.innerHTML = '<p class="text-sm text-gray-500">Your bag is empty.</p>';
      return;
    }

    itemsEl.innerHTML = cart.map(item => `
      <div class="flex gap-3 items-start">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">${item.name}</p>
          <p class="text-xs text-gray-500">Size: ${item.size} &middot; Qty: ${item.qty}</p>
        </div>
        <span class="text-sm font-medium whitespace-nowrap">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
      </div>
    `).join('');

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 1499 ? 0 : 149;
    const total = subtotal + shipping;

    subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
    shippingEl.textContent = shipping === 0 ? 'Free' : '₹' + shipping;
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  }

  // ── Form validation ────────────────────────────

  function getFormData() {
    return {
      name: document.getElementById('ck-name').value.trim(),
      email: document.getElementById('ck-email').value.trim(),
      phone: document.getElementById('ck-phone').value.trim(),
      address1: document.getElementById('ck-address1').value.trim(),
      address2: document.getElementById('ck-address2').value.trim(),
      city: document.getElementById('ck-city').value.trim(),
      state: document.getElementById('ck-state').value.trim(),
      pincode: document.getElementById('ck-pincode').value.trim(),
      payment: document.querySelector('input[name="payment"]:checked').value,
    };
  }

  function validateForm(d) {
    if (!d.name) return 'Please enter your full name.';
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please enter a valid email.';
    if (!d.phone || !/^[6-9]\d{9}$/.test(d.phone)) return 'Please enter a valid 10-digit phone number.';
    if (!d.address1) return 'Please enter your address.';
    if (!d.city) return 'Please enter your city.';
    if (!d.state) return 'Please enter your state.';
    if (!d.pincode || !/^\d{6}$/.test(d.pincode)) return 'Please enter a valid 6-digit pincode.';

    const cart = getCart();
    if (!cart.length) return 'Your bag is empty.';

    if (d.payment === 'cod') {
      const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
      if (subtotal > 5000) return 'Cash on Delivery is available for orders up to ₹5,000. Please pay online.';
    }
    return null;
  }

  // ── Show error ─────────────────────────────────

  function showError(msg) {
    const el = document.getElementById('ck-error');
    if (msg) { el.textContent = msg; el.classList.remove('hidden'); }
    else { el.textContent = ''; el.classList.add('hidden'); }
  }

  // ── Place order ────────────────────────────────

  window.placeOrder = async function () {
    const data = getFormData();
    const err = validateForm(data);
    if (err) { showError(err); return; }
    showError(null);

    const btn = document.getElementById('ck-submit');
    btn.disabled = true;
    btn.textContent = 'Processing…';

    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 1499 ? 0 : 149;
    const total = subtotal + shipping;

    try {
      if (data.payment === 'cod') {
        // COD flow — create order directly
        const res = await fetch(`${API_BASE}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer: data, cart, total, payment_method: 'cod' }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Order creation failed');
        orderSuccess(result.order_id || 'COD-' + Date.now());
      } else {
        // Online payment — Razorpay flow
        const res = await fetch(`${API_BASE}/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer: data, cart, total, payment_method: 'online' }),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Order creation failed');

        openRazorpay({
          orderId: result.razorpay_order_id,
          amount: total * 100,
          customer: data,
          cart,
        });
      }
    } catch (e) {
      showError(e.message || 'Something went wrong. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Place Order';
    }
  };

  // ── Razorpay modal ─────────────────────────────

  function openRazorpay({ orderId, amount, customer, cart }) {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
      name: 'ANISO',
      description: 'Premium Nightwear',
      image: 'brand_assets/Aniso_LOGO.png',
      order_id: orderId,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      theme: { color: '#8B6147' },
      handler: async function (response) {
        // Verify payment on backend
        try {
          const res = await fetch(`${API_BASE}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customer,
              cart,
            }),
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Payment verification failed');
          orderSuccess(result.order_id || response.razorpay_payment_id);
        } catch (e) {
          showError('Payment received but verification failed. Please contact care@aniso.in with your payment ID: ' + response.razorpay_payment_id);
          resetButton();
        }
      },
      modal: {
        ondismiss: function () {
          resetButton();
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response) {
      showError('Payment failed: ' + response.error.description);
      resetButton();
    });
    rzp.open();
  }

  function resetButton() {
    const btn = document.getElementById('ck-submit');
    btn.disabled = false;
    btn.innerHTML = 'Place Order <svg class="inline ml-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  }

  // ── Order success ──────────────────────────────

  function orderSuccess(orderId) {
    // Clear cart
    saveCart([]);
    updateCartCount();

    // Show confirmation
    document.getElementById('ck-order-id').textContent = 'Order ID: ' + orderId;
    document.getElementById('ck-confirmation').classList.remove('hidden');
  }

  // ── Init ───────────────────────────────────────

  document.addEventListener('DOMContentLoaded', renderCheckoutSummary);
})();
