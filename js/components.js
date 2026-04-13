/* ============================================================
   ANISO — Shared Components (Nav, Footer, Modals, Cart Drawer)
   ============================================================ */

function renderNav() {
  const mount = document.getElementById('nav-mount');
  if (!mount) return;
  mount.innerHTML = `
  <!-- Announcement Bar -->
  <div class="bg-gray-900 text-white text-center py-2 relative" id="announcementBar">
    <div class="overflow-hidden">
      <div class="flex gap-8 animate-scroll whitespace-nowrap text-xs tracking-wide font-light">
        <span>Complimentary shipping on all orders above ₹1,499</span>
        <span class="text-gray-500">&middot;</span>
        <span>New Drop — Cute Nightsuit Collection is now live</span>
        <span class="text-gray-500">&middot;</span>
        <span>Easy 14-day returns &amp; exchanges</span>
        <span class="text-gray-500">&middot;</span>
        <span>Complimentary shipping on all orders above ₹1,499</span>
        <span class="text-gray-500">&middot;</span>
        <span>New Drop — Cute Nightsuit Collection is now live</span>
        <span class="text-gray-500">&middot;</span>
        <span>Easy 14-day returns &amp; exchanges</span>
      </div>
    </div>
    <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg leading-none" onclick="this.closest('#announcementBar').remove();sessionStorage.setItem('aniso_ann_closed','1')">&times;</button>
  </div>

  <!-- Navigation -->
  <nav class="sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow" id="navbar">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Left: Hamburger + Links -->
      <div class="flex items-center gap-6">
        <button class="lg:hidden text-gray-700" id="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <ul class="hidden lg:flex items-center gap-6">
          <li><a href="shop.html" class="nav-link text-sm text-gray-900 hover:text-cocoa font-medium tracking-wide transition-colors">Shop</a></li>
          <li><a href="shop.html#collections" class="nav-link text-sm text-gray-900 hover:text-cocoa font-medium tracking-wide transition-colors">Collections</a></li>
          <li><a href="about.html" class="nav-link text-sm text-gray-900 hover:text-cocoa font-medium tracking-wide transition-colors">Our Story</a></li>
        </ul>
      </div>

      <!-- Center: Logo -->
      <a href="index.html" class="absolute left-1/2 -translate-x-1/2">
        <img src="brand_assets/Aniso_LOGO.png" alt="ANISO" class="h-9 sm:h-10">
      </a>

      <!-- Right: Icons -->
      <div class="flex items-center gap-3">
        <button class="text-gray-700 hover:text-gray-900 p-1.5 transition-colors" aria-label="Search" onclick="toggleSearch()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.4-4.4"/></svg>
        </button>

        <div class="relative" id="profileDropdownWrap">
          <button class="text-gray-700 hover:text-gray-900 p-1.5 transition-colors" id="profileBtn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <div class="hidden absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50" id="profileMenu">
            <div id="profileSignedOut">
              <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Welcome to ANISO</div>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onclick="openSignIn('signin');return false;">Sign In</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onclick="openSignIn('register');return false;">Create Account</a>
            </div>
            <div id="profileSignedIn" style="display:none">
              <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider" id="profileGreeting">Hi, there</div>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My Account</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My Orders</a>
              <hr class="my-1 border-gray-100">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onclick="signOut();return false;">Sign Out</a>
            </div>
          </div>
        </div>

        <button class="text-gray-700 hover:text-gray-900 p-1.5 relative transition-colors" aria-label="Cart" onclick="openCartDrawer()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="cart-count absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white text-[10px] rounded-full items-center justify-center font-medium" style="display:none" id="cartCount">0</span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto" id="mobileMenu">
      <ul class="px-6 py-8 space-y-1">
        <li><a href="shop.html" class="block py-3 text-lg font-display text-gray-900 border-b border-gray-100" onclick="toggleMobileMenu()">Shop All</a></li>
        <li><a href="shop.html#collections" class="block py-3 text-lg font-display text-gray-900 border-b border-gray-100" onclick="toggleMobileMenu()">Collections</a></li>
        <li><a href="about.html" class="block py-3 text-lg font-display text-gray-900 border-b border-gray-100" onclick="toggleMobileMenu()">Our Story</a></li>
        <li><a href="size-guide.html" class="block py-3 text-lg font-display text-gray-900 border-b border-gray-100" onclick="toggleMobileMenu()">Size Guide</a></li>
        <li><a href="faq.html" class="block py-3 text-lg font-display text-gray-900 border-b border-gray-100" onclick="toggleMobileMenu()">FAQ</a></li>
        <li><a href="contact.html" class="block py-3 text-lg font-display text-gray-900 border-b border-gray-100" onclick="toggleMobileMenu()">Contact</a></li>
        <li><a href="cart.html" class="block py-3 text-lg font-display text-gray-900" onclick="toggleMobileMenu()">Your Bag</a></li>
      </ul>
    </div>
  </nav>

  <!-- Cart Drawer -->
  <div class="fixed inset-0 bg-black/40 z-[60] opacity-0 pointer-events-none transition-opacity duration-300" id="cartDrawerOverlay" onclick="closeCartDrawer()"></div>
  <div class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col" id="cartDrawer">
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h2 class="font-display text-lg">Your Bag</h2>
      <button onclick="closeCartDrawer()" class="text-gray-500 hover:text-gray-900 transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto px-5" id="cartDrawerItems"></div>
    <div class="border-t border-gray-100 px-5 py-4">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-600">Subtotal</span>
        <span class="text-sm font-medium" id="cartDrawerSubtotal">₹0</span>
      </div>
      <a href="cart.html" class="block w-full text-center bg-gray-900 text-white text-xs font-medium tracking-wider uppercase py-3.5 rounded hover:bg-gray-800 transition-colors" onclick="closeCartDrawer()">View Bag &amp; Checkout</a>
      <button class="block w-full text-center text-xs text-gray-500 mt-3 hover:text-gray-900 transition-colors" onclick="closeCartDrawer()">Continue Shopping</button>
    </div>
  </div>

  <!-- Search Overlay -->
  <div class="fixed inset-0 bg-white z-[80] hidden flex-col" id="searchOverlay">
    <div class="max-w-3xl mx-auto w-full px-4 pt-6">
      <div class="flex items-center gap-3 border-b-2 border-gray-900 pb-3">
        <svg class="text-gray-400 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.4-4.4"/></svg>
        <input type="text" id="searchInput" class="flex-1 text-lg font-body text-gray-900 placeholder-gray-400 outline-none bg-transparent" placeholder="Search products...">
        <button onclick="toggleSearch()" class="text-gray-500 hover:text-gray-900 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="searchResults" class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8 overflow-y-auto" style="max-height:calc(100vh - 120px)"></div>
    </div>
  </div>

  <!-- Sign In Modal -->
  <div class="fixed inset-0 bg-black/40 z-[90] hidden items-center justify-center" id="signinOverlay">
    <div class="bg-white w-full max-w-md mx-4 rounded-xl p-8 relative">
      <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl" onclick="closeSignIn()">&times;</button>
      <div class="flex justify-center mb-4">
        <img src="brand_assets/Aniso_LOGO.png" alt="ANISO" class="h-8">
      </div>
      <h2 class="font-display text-xl text-center text-gray-900 mb-6">My Account</h2>
      <div class="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button class="signin-tab flex-1 text-sm py-2 rounded-md font-medium transition-colors bg-white text-gray-900 shadow-sm" data-tab="signin">Sign In</button>
        <button class="signin-tab flex-1 text-sm py-2 rounded-md font-medium transition-colors text-gray-500" data-tab="register">Create Account</button>
      </div>
      <div id="signinFormWrap">
        <form class="space-y-3" id="signinForm">
          <input class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" type="email" placeholder="Email address" required>
          <input class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" type="password" placeholder="Password" required>
          <button type="submit" class="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors">Sign In</button>
        </form>
        <p class="text-xs text-center text-gray-500 mt-4">Don't have an account? <a href="#" class="text-gray-900 underline underline-offset-2" onclick="openSignIn('register');return false;">Create one</a></p>
      </div>
      <div id="registerFormWrap" style="display:none">
        <form class="space-y-3" id="registerForm">
          <input class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" type="text" name="fullname" placeholder="Full name" required>
          <input class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" type="email" placeholder="Email address" required>
          <input class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-body placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" type="password" placeholder="Create password" required>
          <button type="submit" class="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors">Create Account</button>
        </form>
        <p class="text-xs text-center text-gray-500 mt-4">Already have an account? <a href="#" class="text-gray-900 underline underline-offset-2" onclick="openSignIn('signin');return false;">Sign in</a></p>
      </div>
    </div>
  </div>`;

  // Remove announcement if previously closed
  if (sessionStorage.getItem('aniso_ann_closed')) {
    document.getElementById('announcementBar')?.remove();
  }

  // Nav scroll shadow
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('shadow-sm', window.scrollY > 20);
  }, { passive: true });
}

function renderFooter() {
  const mount = document.getElementById('footer-mount');
  if (!mount) return;
  mount.innerHTML = `
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div class="col-span-2 md:col-span-1">
          <img src="brand_assets/Aniso_LOGO.png" alt="ANISO" class="h-8 mb-4">
          <p class="text-sm font-light leading-relaxed text-gray-400 mb-5">Premium nightwear and loungewear for the modern woman.</p>
          <div class="flex gap-2">
            <input type="email" class="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-gray-500 transition-colors" placeholder="Your email">
            <button class="bg-white text-gray-900 text-xs font-medium px-4 rounded-lg hover:bg-gray-100 transition-colors">Join</button>
          </div>
        </div>
        <div>
          <h4 class="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Shop</h4>
          <ul class="space-y-2.5">
            <li><a href="shop.html" class="text-sm hover:text-white transition-colors">All Products</a></li>
            <li><a href="shop.html?cat=satin" class="text-sm hover:text-white transition-colors">Satin Sets</a></li>
            <li><a href="shop.html?cat=nightsuit" class="text-sm hover:text-white transition-colors">Cute Nightsuits</a></li>
            <li><a href="shop.html?cat=lounge" class="text-sm hover:text-white transition-colors">Lounge Sets</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Help</h4>
          <ul class="space-y-2.5">
            <li><a href="size-guide.html" class="text-sm hover:text-white transition-colors">Size Guide</a></li>
            <li><a href="faq.html" class="text-sm hover:text-white transition-colors">FAQ</a></li>
            <li><a href="contact.html" class="text-sm hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" class="text-sm hover:text-white transition-colors">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Brand</h4>
          <ul class="space-y-2.5">
            <li><a href="about.html" class="text-sm hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" class="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="text-sm hover:text-white transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-500">&copy; 2026 ANISO. All rights reserved. Made with care in India.</p>
        <div class="flex items-center gap-4">
          <a href="#" aria-label="Instagram" class="text-gray-500 hover:text-white transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
          <a href="#" aria-label="WhatsApp" class="text-gray-500 hover:text-white transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
        </div>
        <div class="flex gap-2">
          <span class="text-xs border border-gray-700 rounded px-2 py-0.5 text-gray-500">UPI</span>
          <span class="text-xs border border-gray-700 rounded px-2 py-0.5 text-gray-500">Cards</span>
          <span class="text-xs border border-gray-700 rounded px-2 py-0.5 text-gray-500">COD</span>
        </div>
      </div>
    </div>
  </footer>`;
}

// ── Mobile Menu ───────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const isOpen = !menu.classList.contains('hidden');
  if (isOpen) {
    menu.classList.add('hidden');
    document.body.style.overflow = '';
  } else {
    menu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}
window.toggleMobileMenu = toggleMobileMenu;

// ── Search ────────────────────────────────────────────────────
function toggleSearch() {
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  const isOpen = !overlay.classList.contains('hidden');
  if (isOpen) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
  } else {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
    document.getElementById('searchInput')?.focus();
  }
}
window.toggleSearch = toggleSearch;

// ── Auth / Profile ────────────────────────────────────────────
const AUTH_KEY = 'aniso_user';
function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}
function saveUser(user) { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); }
function signOut() {
  localStorage.removeItem(AUTH_KEY);
  updateProfileUI();
  document.getElementById('profileMenu')?.classList.add('hidden');
}
window.signOut = signOut;

function openSignIn(tab) {
  const overlay = document.getElementById('signinOverlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.style.overflow = 'hidden';
  if (tab) {
    const tabs = overlay.querySelectorAll('.signin-tab');
    tabs.forEach(t => {
      const isTarget = t.dataset.tab === tab;
      t.classList.toggle('bg-white', isTarget);
      t.classList.toggle('text-gray-900', isTarget);
      t.classList.toggle('shadow-sm', isTarget);
      t.classList.toggle('text-gray-500', !isTarget);
    });
    const isSignIn = tab === 'signin';
    const sw = document.getElementById('signinFormWrap');
    const rg = document.getElementById('registerFormWrap');
    if (sw) sw.style.display = isSignIn ? '' : 'none';
    if (rg) rg.style.display = isSignIn ? 'none' : '';
  }
}
function closeSignIn() {
  const overlay = document.getElementById('signinOverlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
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
      overlay.querySelectorAll('.signin-tab').forEach(t => {
        t.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
        t.classList.add('text-gray-500');
      });
      tab.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
      tab.classList.remove('text-gray-500');
      const isSignIn = tab.dataset.tab === 'signin';
      const sw = document.getElementById('signinFormWrap');
      const rg = document.getElementById('registerFormWrap');
      if (sw) sw.style.display = isSignIn ? '' : 'none';
      if (rg) rg.style.display = isSignIn ? 'none' : '';
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
    menu.classList.toggle('hidden');
  });

  document.addEventListener('click', e => {
    const wrap = document.getElementById('profileDropdownWrap');
    if (wrap && !wrap.contains(e.target)) {
      document.getElementById('profileMenu')?.classList.add('hidden');
    }
  });

  updateProfileUI();
}

// ── Search Init ───────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim();
      const results = document.getElementById('searchResults');
      if (!results) return;

      if (!q) { results.innerHTML = ''; return; }

      const products = typeof searchProducts === 'function' ? searchProducts(q) : [];
      if (!products.length) {
        results.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">No products found for "${q}"</p>`;
        return;
      }

      results.innerHTML = products.map(p => `
        <a href="product.html?id=${p.id}" class="group" onclick="toggleSearch()">
          <div class="aspect-[3/4] overflow-hidden rounded-lg bg-gray-50 mb-2">
            <img src="${p.images[0].src}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
          </div>
          <p class="text-sm font-medium text-gray-900 group-hover:underline">${p.title}</p>
          <p class="text-sm text-gray-500">₹${p.price.toLocaleString('en-IN')}</p>
        </a>`).join('');
    }, 300);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('searchOverlay');
      if (overlay && !overlay.classList.contains('hidden')) toggleSearch();
    }
  });
}

// ── Fade-in Observer ──────────────────────────────────────────
function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('opacity-100', 'translate-y-0');
        e.target.classList.remove('opacity-0', 'translate-y-4');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
    obs.observe(el);
  });
}

// ── FAQ Accordion ─────────────────────────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
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
    trigger.addEventListener('click', () => item.classList.toggle('open'));
  });
}

// ── Magnetic Cursor Glow on Product Cards ────────────────────
function initCardGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices
  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.group');
    if (!card) return;
    const imgWrap = card.querySelector('a');
    if (!imgWrap) return;
    let glow = imgWrap.querySelector('.card-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'card-glow';
      glow.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity 0.3s ease;border-radius:inherit;z-index:5';
      imgWrap.style.position = 'relative';
      imgWrap.appendChild(glow);
    }
    const r = imgWrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glow.style.background = `radial-gradient(280px circle at ${x}px ${y}px, rgba(232,180,160,0.14), transparent 70%)`;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', e => {
    if (e.target.closest && e.target.closest('.group')) {
      const glow = e.target.closest('.group').querySelector('.card-glow');
      if (glow) glow.style.opacity = '0';
    }
  }, true);
  // Clear glow when leaving card
  document.addEventListener('mouseout', e => {
    const card = e.target.closest('.group');
    if (card && !card.contains(e.relatedTarget)) {
      const glow = card.querySelector('.card-glow');
      if (glow) glow.style.opacity = '0';
    }
  });
}

// ── Init All ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  updateCartCount();
  initAuth();
  initSearch();
  initFadeIn();
  initFaq();
  initPdpAcc();
  initCardGlow();
  renderCart();
  if (typeof renderCartDrawer === 'function') renderCartDrawer();
});
