/* ============================================================
   ANISO — Main JS
   ============================================================ */

const CART_KEY = 'aniso_cart';

// ── Cart State ──────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.size === product.size);
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cart.push({ ...product, qty: product.qty || 1 });
  }
  saveCart(cart);
  showCartToast(product.name);
}
window.addToCart = addToCart;

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
}
window.updateCartItemQty = updateCartItemQty;

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}

// ── Toast ────────────────────────────────────────────────────
function showCartToast(name) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <div class="toast-inner">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>
      <span>${name} added to your bag</span>
      <a href="cart.html" class="toast-view">View Bag →</a>
    </div>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3600);
}

// ── Announcement Bar ─────────────────────────────────────────
function closeAnnouncement() {
  const bar = document.getElementById('announcementBar');
  if (!bar) return;
  bar.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  bar.style.height = bar.offsetHeight + 'px';
  bar.offsetHeight;
  bar.style.height = '0';
  bar.style.opacity = '0';
  bar.style.overflow = 'hidden';
  setTimeout(() => bar.remove(), 320);
  sessionStorage.setItem('aniso_ann_closed', '1');
}
window.closeAnnouncement = closeAnnouncement;

// ── Mobile Menu ───────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  if (!menu) return;
  const open = menu.classList.toggle('open');
  btn && btn.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
window.toggleMobileMenu = toggleMobileMenu;

// ── Navbar scroll ─────────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── FAQ Accordion ─────────────────────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ── PDP Accordion ─────────────────────────────────────────────
function initPdpAcc() {
  document.querySelectorAll('.pdp-acc-item').forEach(item => {
    const trigger = item.querySelector('.pdp-acc-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

// ── Size Selector ─────────────────────────────────────────────
function initSizeSelector() {
  document.querySelectorAll('.size-options').forEach(group => {
    group.querySelectorAll('.size-option:not(.out-of-stock)').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });
}

// ── Qty Selector ──────────────────────────────────────────────
function initQty() {
  document.querySelectorAll('.qty-selector').forEach(sel => {
    const input  = sel.querySelector('.qty-input');
    const minus  = sel.querySelector('.qty-minus');
    const plus   = sel.querySelector('.qty-plus');
    if (!input) return;
    minus && minus.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value || 1) - 1);
    });
    plus && plus.addEventListener('click', () => {
      input.value = Math.min(10, parseInt(input.value || 1) + 1);
    });
  });
}

// ── PDP Gallery thumbs ────────────────────────────────────────
function initGallery() {
  const mainImg = document.getElementById('pdpMainImg');
  if (!mainImg) return;
  document.querySelectorAll('.pdp-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.querySelector('img')?.src;
      if (src) mainImg.src = src;
    });
  });
}

// ── Add to Cart (PDP) ─────────────────────────────────────────
function initPdpAddToCart() {
  const btn = document.getElementById('pdpAddToCartBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const sizeEl = document.querySelector('.size-option.selected');
    if (!sizeEl) {
      // Shake the size selector
      const opts = document.querySelector('.size-options');
      if (opts) {
        opts.style.animation = 'none';
        opts.offsetHeight;
        opts.style.animation = 'shake 0.4s ease';
      }
      return;
    }
    const qty = parseInt(document.querySelector('.pdp-info .qty-input')?.value || 1);
    const product = {
      id:       btn.dataset.id,
      name:     btn.dataset.name,
      price:    parseInt(btn.dataset.price),
      image:    btn.dataset.image,
      category: btn.dataset.category,
      size:     sizeEl.textContent.trim(),
      qty,
    };
    addToCart(product);
  });
}

// ── Cart Page Render ──────────────────────────────────────────
function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h3>Your bag is empty</h3>
        <p>Discover our curated collection of premium nightwear.</p>
        <a href="shop.html" class="btn-primary">Shop the Collection</a>
      </div>`;
    updateCartTotal();
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-category">${item.category || ''}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: ${item.size}</div>
        <div class="cart-item-actions">
          <div class="qty-selector small">
            <button class="qty-minus" onclick="updateCartItemQty('${item.id}','${item.size}',${item.qty-1})">−</button>
            <input type="number" class="qty-input" value="${item.qty}" min="1" max="10" readonly>
            <button class="qty-plus" onclick="updateCartItemQty('${item.id}','${item.size}',${item.qty+1})">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}','${item.size}');renderCart();">Remove</button>
        </div>
      </div>
      <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
    </div>`).join('');
  updateCartTotal();
}
window.renderCart = renderCart;

function updateCartTotal() {
  const cart  = getCart();
  const sub   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = sub >= 1499 ? 0 : 149;
  const el = id => document.getElementById(id);
  if (el('cartSubtotal')) el('cartSubtotal').textContent = `₹${sub.toLocaleString('en-IN')}`;
  if (el('cartShipping')) el('cartShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
  if (el('cartTotal'))    el('cartTotal').textContent    = `₹${(sub + shipping).toLocaleString('en-IN')}`;
  if (el('cartShippingNote')) {
    el('cartShippingNote').textContent = sub >= 1499
      ? 'You qualify for free shipping!'
      : `Add ₹${(1499-sub).toLocaleString('en-IN')} more for free shipping`;
  }
}

// ── Fade-in observer ──────────────────────────────────────────
function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ── Active nav link ───────────────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });
}

// shake keyframe injection
const style = document.createElement('style');
style.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;
document.head.appendChild(style);

// ── Color Variant Image Swap ──────────────────────────────────
function initColorSwap() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.querySelectorAll('.color-dot[data-img]').forEach(dot => {
      dot.addEventListener('click', () => {
        card.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const img = card.querySelector('.product-card-img');
        if (!img || !dot.dataset.img) return;
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = dot.dataset.img;
          img.onload = () => { img.style.opacity = '1'; };
          img.onerror = () => { img.style.opacity = '1'; };
        }, 160);
      });
    });
  });
}

// ── Auth / Profile ────────────────────────────────────────────
const AUTH_KEY = 'aniso_user';
function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}
function saveUser(user) { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); }
function signOut() {
  localStorage.removeItem(AUTH_KEY);
  updateProfileUI();
  document.getElementById('profileMenu')?.classList.remove('open');
}
window.signOut = signOut;

function openSignIn(tab) {
  const overlay = document.getElementById('signinOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (tab) {
    const btn = overlay.querySelector(`[data-tab="${tab}"]`);
    btn && btn.click();
  }
}
function closeSignIn() {
  document.getElementById('signinOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}
window.openSignIn = openSignIn;
window.closeSignIn = closeSignIn;

function updateProfileUI() {
  const user = getUser();
  document.querySelectorAll('#profileSignedIn').forEach(el => {
    el.style.display = user ? '' : 'none';
  });
  document.querySelectorAll('#profileSignedOut').forEach(el => {
    el.style.display = user ? 'none' : '';
  });
  document.querySelectorAll('#profileGreeting').forEach(el => {
    el.textContent = user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome to ANISO';
  });
}

function initAuth() {
  const overlay = document.getElementById('signinOverlay');
  if (!overlay) return;

  overlay.addEventListener('click', e => { if (e.target === overlay) closeSignIn(); });

  overlay.querySelectorAll('.signin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.signin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isSignIn = tab.dataset.tab === 'signin';
      const swWrap = document.getElementById('signinFormWrap');
      const rgWrap = document.getElementById('registerFormWrap');
      if (swWrap) swWrap.style.display = isSignIn ? '' : 'none';
      if (rgWrap) rgWrap.style.display = isSignIn ? 'none' : '';
    });
  });

  document.getElementById('signinForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.querySelector('[type=email]').value;
    const name = email.split('@')[0].replace(/[._-]/g, ' ');
    saveUser({ email, name: name.charAt(0).toUpperCase() + name.slice(1) });
    closeSignIn();
    updateProfileUI();
  });

  document.getElementById('registerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = e.target.querySelector('[name=fullname]').value;
    const email = e.target.querySelector('[type=email]').value;
    saveUser({ email, name });
    closeSignIn();
    updateProfileUI();
  });

  document.getElementById('profileBtn')?.addEventListener('click', e => {
    e.stopPropagation();
    const menu = document.getElementById('profileMenu');
    if (!menu) return;
    const willOpen = !menu.classList.contains('open');
    menu.classList.toggle('open', willOpen);
  });

  document.addEventListener('click', e => {
    const wrap = document.getElementById('profileDropdownWrap');
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById('profileMenu')?.classList.remove('open');
    }
  });

  updateProfileUI();
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('aniso_ann_closed')) {
    document.getElementById('announcementBar')?.remove();
  }
  updateCartCount();
  initNavScroll();
  initFaq();
  initPdpAcc();
  initSizeSelector();
  initQty();
  initGallery();
  initPdpAddToCart();
  initFadeIn();
  renderCart();
  setActiveNav();
  initColorSwap();
  initAuth();
});
