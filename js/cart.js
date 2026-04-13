/* ============================================================
   ANISO — Cart Module
   ============================================================ */

const CART_KEY = 'aniso_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, triggerEl) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.size === product.size);
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }
  saveCart(cart);

  // Flying thumbnail animation
  flyToCart(product.image, triggerEl);

  showCartToast(product.name);
  openCartDrawer();
}
window.addToCart = addToCart;

function flyToCart(imgSrc, triggerEl) {
  const cartIcon = document.querySelector('[aria-label="Cart"]');
  if (!cartIcon || !imgSrc) return;

  // Find the source element (button that was clicked or the product card image)
  let srcRect;
  if (triggerEl) {
    srcRect = triggerEl.getBoundingClientRect();
  } else {
    // Fallback: use last hovered product image
    const hovered = document.querySelector('.group:hover img');
    if (hovered) srcRect = hovered.getBoundingClientRect();
    else return;
  }
  const destRect = cartIcon.getBoundingClientRect();

  const thumb = document.createElement('img');
  thumb.src = imgSrc;
  thumb.style.cssText = `position:fixed;z-index:9999;width:${Math.min(srcRect.width, 80)}px;height:${Math.min(srcRect.height, 100)}px;object-fit:cover;border-radius:8px;pointer-events:none;box-shadow:0 8px 30px rgba(0,0,0,0.15)`;
  thumb.style.left = srcRect.left + srcRect.width / 2 - 40 + 'px';
  thumb.style.top = srcRect.top + 'px';
  document.body.appendChild(thumb);

  const dx = destRect.left + destRect.width / 2 - (srcRect.left + srcRect.width / 2);
  const dy = destRect.top + destRect.height / 2 - srcRect.top;

  thumb.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px, ${dy * 0.3 - 60}px) scale(0.5)`, opacity: 0.8, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0.2 },
  ], {
    duration: 650,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fill: 'forwards',
  }).onfinish = () => {
    thumb.remove();
    // Pulse the cart icon
    cartIcon.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(1)' },
    ], { duration: 300, easing: 'ease-out' });
  };
}

function removeFromCart(id, size) {
  saveCart(getCart().filter(i => !(i.id === id && i.size === size)));
}
window.removeFromCart = removeFromCart;

function updateCartItemQty(id, size, newQty) {
  if (newQty < 1) { removeFromCart(id, size); }
  else {
    const cart = getCart();
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) { item.qty = Math.min(10, newQty); saveCart(cart); }
  }
  renderCart();
  renderCartDrawer();
}
window.updateCartItemQty = updateCartItemQty;

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Toast notification
function showCartToast(name) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-white border border-gray-200 rounded-lg shadow-lg px-5 py-3 flex items-center gap-3 opacity-0 translate-y-4 pointer-events-none';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg class="text-green-600 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
    <span class="text-sm font-body text-gray-900">${name} added to bag</span>
    <a href="cart.html" class="text-xs font-medium text-cocoa hover:underline whitespace-nowrap">View Bag &rarr;</a>
  `;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.pointerEvents = 'auto';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(16px)';
    toast.style.pointerEvents = 'none';
  }, 3000);
}

// Cart Drawer
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.remove('translate-x-full');
  drawer.classList.add('translate-x-0');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
}
window.openCartDrawer = openCartDrawer;

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (!drawer) return;
  drawer.classList.remove('translate-x-0');
  drawer.classList.add('translate-x-full');
  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}
window.closeCartDrawer = closeCartDrawer;

function renderCartDrawer() {
  const container = document.getElementById('cartDrawerItems');
  if (!container) return;
  const cart = getCart();
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (!cart.length) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-center px-6">
        <svg class="text-gray-300 mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p class="font-display text-lg text-gray-500 mb-2">Your bag is empty</p>
        <a href="shop.html" class="text-sm text-cocoa hover:underline" onclick="closeCartDrawer()">Continue Shopping &rarr;</a>
      </div>`;
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    if (subtotalEl) subtotalEl.textContent = '₹0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="flex gap-3 py-4 border-b border-gray-100">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded" loading="lazy">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">${item.name}</p>
        <p class="text-xs text-gray-500 mt-0.5">${item.category} &middot; Size ${item.size}</p>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-2 border border-gray-200 rounded">
            <button class="px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900" onclick="updateCartItemQty('${item.id}','${item.size}',${item.qty - 1})">&minus;</button>
            <span class="text-sm w-5 text-center">${item.qty}</span>
            <button class="px-2 py-0.5 text-sm text-gray-600 hover:text-gray-900" onclick="updateCartItemQty('${item.id}','${item.size}',${item.qty + 1})">&plus;</button>
          </div>
          <span class="text-sm font-medium">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
        </div>
      </div>
      <button class="text-gray-400 hover:text-gray-700 self-start mt-1" onclick="removeFromCart('${item.id}','${item.size}');renderCartDrawer();">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');

  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  if (subtotalEl) subtotalEl.textContent = `₹${sub.toLocaleString('en-IN')}`;
}

// Cart page rendering
function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="text-center py-16">
        <svg class="mx-auto text-gray-300 mb-4" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <h3 class="font-display text-xl text-gray-700 mb-2">Your bag is empty</h3>
        <p class="text-sm text-gray-500 mb-6">Discover our curated collection of premium nightwear.</p>
        <a href="shop.html" class="inline-block bg-gray-900 text-white text-xs font-medium tracking-wider uppercase px-8 py-3 rounded hover:bg-gray-800 transition-colors">Shop the Collection</a>
      </div>`;
    updateCartTotal();
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="flex gap-4 py-5 border-b border-gray-100">
      <a href="product.html?id=${item.id}">
        <img src="${item.image}" alt="${item.name}" class="w-24 h-32 object-cover rounded" loading="lazy">
      </a>
      <div class="flex-1">
        <p class="text-xs text-gray-500 uppercase tracking-wide">${item.category || ''}</p>
        <p class="text-sm font-medium text-gray-900 mt-0.5">${item.name}</p>
        <p class="text-xs text-gray-500 mt-1">Size: ${item.size}</p>
        <div class="flex items-center gap-4 mt-3">
          <div class="flex items-center border border-gray-200 rounded">
            <button class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors" onclick="updateCartItemQty('${item.id}','${item.size}',${item.qty - 1})">&minus;</button>
            <span class="text-sm w-8 text-center font-medium">${item.qty}</span>
            <button class="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors" onclick="updateCartItemQty('${item.id}','${item.size}',${item.qty + 1})">&plus;</button>
          </div>
          <button class="text-xs text-gray-500 hover:text-red-600 underline underline-offset-2 transition-colors" onclick="removeFromCart('${item.id}','${item.size}');renderCart();">Remove</button>
        </div>
      </div>
      <div class="text-sm font-medium text-gray-900">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
    </div>`).join('');
  updateCartTotal();
}
window.renderCart = renderCart;

function updateCartTotal() {
  const cart = getCart();
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = sub >= 1499 ? 0 : (sub > 0 ? 149 : 0);
  const el = id => document.getElementById(id);
  if (el('cartSubtotal')) el('cartSubtotal').textContent = `₹${sub.toLocaleString('en-IN')}`;
  if (el('cartShipping')) el('cartShipping').textContent = shipping === 0 ? (sub > 0 ? 'Free' : '—') : `₹${shipping}`;
  if (el('cartTotal')) el('cartTotal').textContent = `₹${(sub + shipping).toLocaleString('en-IN')}`;
  if (el('cartShippingNote')) {
    el('cartShippingNote').textContent = sub >= 1499
      ? 'You qualify for free shipping!'
      : sub > 0 ? `Add ₹${(1499 - sub).toLocaleString('en-IN')} more for free shipping` : '';
  }
}
