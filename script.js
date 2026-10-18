// =========================================================
// بازارچه — app logic
// =========================================================
(() => {
  'use strict';

  /* ---------- Persian number helpers ---------- */
  const faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  const toFa = (num) => String(num).replace(/[0-9]/g, d => faDigits[d]);
  const formatPrice = (num) => toFa(num.toLocaleString('en-US')) + ' تومان';
  const pad2 = (n) => toFa(String(n).padStart(2, '0'));

  /* ---------- Product data ---------- */
  const PRODUCTS = [
    { id: 1,  name: 'گوشی موبایل مدل گلکسی A54',      cat: 'mobile',  icon: 'fa-mobile-screen', price: 15200000, old: 17000000, rating: 4.6, badge: '۱۰٪ تخفیف', deal: true },
    { id: 2,  name: 'هدفون بی‌سیم مدل ایرفری',          cat: 'mobile',  icon: 'fa-headphones',    price: 1850000,  old: null,     rating: 4.3, badge: null,        deal: false },
    { id: 3,  name: 'ساعت هوشمند مدل فیت‌برند',         cat: 'mobile',  icon: 'fa-clock',         price: 2300000,  old: 2750000,  rating: 4.4, badge: '۱۶٪ تخفیف', deal: true },
    { id: 4,  name: 'لپ‌تاپ ایسوس مدل VivoBook',        cat: 'laptop',  icon: 'fa-laptop',        price: 32500000, old: null,     rating: 4.7, badge: null,        deal: false },
    { id: 5,  name: 'مانیتور ۲۷ اینچ ال‌جی',            cat: 'laptop',  icon: 'fa-display',       price: 9800000,  old: 11500000, rating: 4.5, badge: '۱۵٪ تخفیف', deal: true },
    { id: 6,  name: 'ماوس گیمینگ بی‌سیم',                cat: 'laptop',  icon: 'fa-computer-mouse',price: 890000,   old: null,     rating: 4.2, badge: null,        deal: false },
    { id: 7,  name: 'اتوی بخار فیلیپس',                  cat: 'home',    icon: 'fa-plug',          price: 1450000,  old: null,     rating: 4.1, badge: null,        deal: false },
    { id: 8,  name: 'مخلوط‌کن پارس‌خزر',                 cat: 'home',    icon: 'fa-blender',       price: 980000,   old: 1200000,  rating: 4.3, badge: '۱۸٪ تخفیف', deal: true },
    { id: 9,  name: 'جاروبرقی رباتیک هوشمند',            cat: 'home',    icon: 'fa-house',         price: 6200000,  old: null,     rating: 4.4, badge: 'جدید',      deal: false },
    { id: 10, name: 'کفش کتانی مدل رانر',                cat: 'fashion', icon: 'fa-shoe-prints',   price: 2150000,  old: 2700000,  rating: 4.5, badge: '۲۰٪ تخفیف', deal: true },
    { id: 11, name: 'کیف دستی چرم زنانه',                cat: 'fashion', icon: 'fa-bag-shopping',  price: 1780000,  old: null,     rating: 4.6, badge: 'پرفروش',    deal: false },
    { id: 12, name: 'عطر مردانه مدل وودی',               cat: 'beauty',  icon: 'fa-spray-can-sparkles', price: 1250000, old: null, rating: 4.2, badge: null,        deal: false },
    { id: 13, name: 'ست مراقبت پوست صورت',               cat: 'beauty',  icon: 'fa-spa',           price: 970000,   old: 1150000,  rating: 4.4, badge: '۱۵٪ تخفیف', deal: true },
  ];

  const CATEGORIES = [
    { name: 'موبایل و تبلت',   icon: 'fa-mobile-screen-button', cls: 'cat-mobile',  filter: 'mobile' },
    { name: 'لپ‌تاپ و کامپیوتر', icon: 'fa-laptop',              cls: 'cat-laptop',  filter: 'laptop' },
    { name: 'لوازم خانگی',      icon: 'fa-blender',              cls: 'cat-home',    filter: 'home' },
    { name: 'مد و پوشاک',       icon: 'fa-shirt',                cls: 'cat-fashion', filter: 'fashion' },
    { name: 'زیبایی و سلامت',   icon: 'fa-spa',                  cls: 'cat-beauty',  filter: 'beauty' },
    { name: 'ورزش و سفر',       icon: 'fa-person-running',       cls: 'cat-turquoise-alt', filter: 'all' },
    { name: 'کتاب و لوازم تحریر', icon: 'fa-book',               cls: 'cat-indigo-alt',    filter: 'all' },
    { name: 'اسباب‌بازی کودک',  icon: 'fa-baby',                 cls: 'cat-pink-alt',      filter: 'all' },
  ];
  // reuse existing gradient classes for the two "extra" categories to stay within design tokens
  CATEGORIES.forEach(c => {
    if (c.cls === 'cat-turquoise-alt') c.cls = 'cat-mobile';
    if (c.cls === 'cat-indigo-alt') c.cls = 'cat-laptop';
    if (c.cls === 'cat-pink-alt') c.cls = 'cat-beauty';
  });

  const state = {
    wishlist: new Set(),
    cart: new Map(), // id -> qty
    filter: 'all',
  };

  /* ---------- Helpers to build a product card ---------- */
  function productCard(p) {
    const isFav = state.wishlist.has(p.id);
    const inCart = state.cart.has(p.id);
    return `
      <article class="product-card reveal in-view" data-category="${p.cat}" data-id="${p.id}">
        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${p.id}" aria-label="افزودن به علاقه‌مندی‌ها">
          <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        ${p.badge ? `<span class="badge-tag">${p.badge}</span>` : ''}
        <div class="product-image cat-${p.cat}"><i class="fa-solid ${p.icon}"></i></div>
        <div class="product-info">
          <span class="product-cat">${catLabel(p.cat)}</span>
          <h3>${p.name}</h3>
          <div class="rating"><i class="fa-solid fa-star"></i> ${toFa(p.rating)} <span>(امتیاز خریداران)</span></div>
          <div class="price-row">
            ${p.old ? `<span class="old-price">${formatPrice(p.old)}</span>` : ''}
            <span class="price">${formatPrice(p.price)}</span>
          </div>
          <button class="btn-add-cart ${inCart ? 'added' : ''}" data-id="${p.id}">
            <i class="fa-solid ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'در سبد خرید' : 'افزودن به سبد'}
          </button>
        </div>
      </article>`;
  }

  function catLabel(cat) {
    return { mobile: 'موبایل و لوازم جانبی', laptop: 'لپ‌تاپ و کامپیوتر', home: 'لوازم خانگی', fashion: 'مد و پوشاک', beauty: 'زیبایی و سلامت' }[cat] || '';
  }

  /* ---------- Render ---------- */
  const productGrid = document.getElementById('productGrid');
  const dealsGrid = document.getElementById('dealsGrid');
  const categoryGrid = document.getElementById('categoryGrid');

  function renderCategories() {
    categoryGrid.innerHTML = CATEGORIES.map(c => `
      <div class="category-card reveal in-view" data-filter="${c.filter}">
        <div class="category-icon ${c.cls}"><i class="fa-solid ${c.icon}"></i></div>
        <span>${c.name}</span>
      </div>`).join('');

    categoryGrid.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const f = card.dataset.filter;
        setFilter(f);
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function renderProducts() {
    productGrid.innerHTML = PRODUCTS.map(productCard).join('');
    bindCardEvents(productGrid);
    applyFilter();
  }

  function renderDeals() {
    const deals = PRODUCTS.filter(p => p.deal);
    dealsGrid.innerHTML = deals.map(productCard).join('');
    bindCardEvents(dealsGrid);
  }

  function bindCardEvents(container) {
    container.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleWishlist(Number(btn.dataset.id)));
    });
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
    });
  }

  function refreshAllCardStates() {
    document.querySelectorAll('.product-card').forEach(card => {
      const id = Number(card.dataset.id);
      const favBtn = card.querySelector('.fav-btn');
      const cartBtn = card.querySelector('.btn-add-cart');
      const isFav = state.wishlist.has(id);
      const inCart = state.cart.has(id);
      favBtn.classList.toggle('active', isFav);
      favBtn.querySelector('i').className = `fa-${isFav ? 'solid' : 'regular'} fa-heart`;
      cartBtn.classList.toggle('added', inCart);
      cartBtn.innerHTML = `<i class="fa-solid ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i> ${inCart ? 'در سبد خرید' : 'افزودن به سبد'}`;
    });
  }

  /* ---------- Filters ---------- */
  function setFilter(filter) {
    state.filter = filter;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === filter));
    applyFilter();
  }
  function applyFilter() {
    document.querySelectorAll('#productGrid .product-card').forEach(card => {
      const show = state.filter === 'all' || card.dataset.category === state.filter;
      card.classList.toggle('hidden-item', !show);
    });
  }
  document.getElementById('filterChips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) setFilter(chip.dataset.filter);
  });

  /* ---------- Wishlist ---------- */
  function toggleWishlist(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (state.wishlist.has(id)) {
      state.wishlist.delete(id);
      showToast(`«${product.name}» از علاقه‌مندی‌ها حذف شد`, 'fa-heart-crack');
    } else {
      state.wishlist.add(id);
      showToast(`«${product.name}» به علاقه‌مندی‌ها اضافه شد`, 'fa-heart');
    }
    refreshAllCardStates();
    updateCounts();
    renderWishlistDrawer();
    // pop animation
    document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(b => {
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    });
  }

  function renderWishlistDrawer() {
    const container = document.getElementById('wishlistItems');
    if (state.wishlist.size === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-regular fa-heart"></i>لیست علاقه‌مندی‌های شما خالی است</div>`;
      return;
    }
    container.innerHTML = [...state.wishlist].map(id => {
      const p = PRODUCTS.find(x => x.id === id);
      return `
        <div class="wish-item">
          <div class="item-thumb cat-${p.cat}"><i class="fa-solid ${p.icon}"></i></div>
          <div class="item-info">
            <h4>${p.name}</h4>
            <span class="price">${formatPrice(p.price)}</span><br>
            <a href="#" class="remove-item" data-id="${p.id}">حذف از علاقه‌مندی‌ها</a>
          </div>
        </div>`;
    }).join('');
    container.querySelectorAll('.remove-item').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); toggleWishlist(Number(a.dataset.id)); });
    });
  }

  /* ---------- Cart ---------- */
  function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const currentQty = state.cart.get(id) || 0;
    state.cart.set(id, currentQty + 1);
    showToast(`«${product.name}» به سبد خرید اضافه شد`, 'fa-cart-plus');
    refreshAllCardStates();
    updateCounts();
    renderCartDrawer();
  }
  function changeQty(id, delta) {
    const current = state.cart.get(id) || 0;
    const next = current + delta;
    if (next <= 0) { state.cart.delete(id); } else { state.cart.set(id, next); }
    refreshAllCardStates();
    updateCounts();
    renderCartDrawer();
  }
  function removeFromCart(id) {
    state.cart.delete(id);
    refreshAllCardStates();
    updateCounts();
    renderCartDrawer();
  }

  function renderCartDrawer() {
    const container = document.getElementById('cartItems');
    if (state.cart.size === 0) {
      container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-cart-shopping"></i>سبد خرید شما خالی است</div>`;
      document.getElementById('cartTotal').textContent = formatPrice(0);
      return;
    }
    let total = 0;
    container.innerHTML = [...state.cart.entries()].map(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === id);
      total += p.price * qty;
      return `
        <div class="cart-item">
          <div class="item-thumb cat-${p.cat}"><i class="fa-solid ${p.icon}"></i></div>
          <div class="item-info">
            <h4>${p.name}</h4>
            <span class="price">${formatPrice(p.price)}</span>
            <div class="qty-control">
              <button data-id="${p.id}" data-delta="-1" aria-label="کاهش">−</button>
              <span>${toFa(qty)}</span>
              <button data-id="${p.id}" data-delta="1" aria-label="افزایش">+</button>
              <a href="#" class="remove-item" data-id="${p.id}" style="margin-inline-start:auto;">حذف</a>
            </div>
          </div>
        </div>`;
    }).join('');
    document.getElementById('cartTotal').textContent = formatPrice(total);

    container.querySelectorAll('.qty-control button').forEach(btn => {
      btn.addEventListener('click', () => changeQty(Number(btn.dataset.id), Number(btn.dataset.delta)));
    });
    container.querySelectorAll('.remove-item').forEach(a => {
      a.addEventListener('click', (e) => { e.preventDefault(); removeFromCart(Number(a.dataset.id)); });
    });
  }

  function updateCounts() {
    const cartCount = [...state.cart.values()].reduce((a, b) => a + b, 0);
    const wishCount = state.wishlist.size;
    [document.getElementById('cartCount'), document.getElementById('mobileCartCount')].forEach(el => {
      el.textContent = toFa(cartCount);
      el.classList.toggle('show', cartCount > 0);
    });
    [document.getElementById('wishlistCount'), document.getElementById('mobileWishlistCount')].forEach(el => {
      el.textContent = toFa(wishCount);
      el.classList.toggle('show', wishCount > 0);
    });
  }

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (state.cart.size === 0) { showToast('سبد خرید شما خالی است', 'fa-circle-exclamation'); return; }
    showToast('این بخش صرفاً نمایشی است — نمونه‌کار طراحی 🎨', 'fa-circle-info');
  });

  /* ---------- Theme toggle (session only — no storage per artifact rules) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  function setTheme(isDark) {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    themeToggle.querySelector('i').className = `fa-solid ${icon}`;
    themeToggleMobile.querySelector('i').className = `fa-solid ${icon}`;
    themeToggleMobile.querySelector('span').textContent = isDark ? 'حالت روز' : 'حالت شب';
  }
  function toggleTheme() {
    const isDark = root.getAttribute('data-theme') !== 'dark';
    setTheme(isDark);
    themeToggle.classList.add('spin');
    setTimeout(() => themeToggle.classList.remove('spin'), 500);
  }
  // Respect system preference on first load
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark);
  themeToggle.addEventListener('click', toggleTheme);
  themeToggleMobile.addEventListener('click', toggleTheme);

  /* ---------- Hamburger / mobile menu ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
  });
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', () => { closeMobileMenu(); closeCart(); closeWishlist(); closeAuth(); });
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => { if (!link.id) closeMobileMenu(); });
  });

  /* ---------- Auth modal ---------- */
  const authOverlay = document.getElementById('authOverlay');
  const authClose = document.getElementById('authClose');
  function openAuth() { authOverlay.classList.add('active'); }
  function closeAuth() { authOverlay.classList.remove('active'); }
  document.getElementById('loginBtn').addEventListener('click', openAuth);
  document.getElementById('mobileLogin').addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); openAuth(); });
  authClose.addEventListener('click', closeAuth);
  authOverlay.addEventListener('click', (e) => { if (e.target === authOverlay) closeAuth(); });

  function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
  }
  document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  document.querySelectorAll('[data-tab-switch]').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); switchTab(link.dataset.tabSwitch); });
  });
  document.getElementById('loginPanel').addEventListener('submit', (e) => {
    e.preventDefault(); closeAuth(); showToast('این بخش صرفاً نمایشی است — خوش آمدید!', 'fa-face-smile');
  });
  document.getElementById('registerPanel').addEventListener('submit', (e) => {
    e.preventDefault(); closeAuth(); showToast('حساب کاربری با موفقیت ساخته شد (نمایشی)', 'fa-circle-check');
  });

  /* ---------- Cart / wishlist drawers ---------- */
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  function openCart() { cartDrawer.classList.add('active'); cartOverlay.classList.add('active'); cartDrawer.setAttribute('aria-hidden', 'false'); }
  function closeCart() { cartDrawer.classList.remove('active'); cartOverlay.classList.remove('active'); cartDrawer.setAttribute('aria-hidden', 'true'); }
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('mobileCart').addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); openCart(); });
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const wishlistOverlay = document.getElementById('wishlistOverlay');
  function openWishlist() { wishlistDrawer.classList.add('active'); wishlistOverlay.classList.add('active'); wishlistDrawer.setAttribute('aria-hidden', 'false'); }
  function closeWishlist() { wishlistDrawer.classList.remove('active'); wishlistOverlay.classList.remove('active'); wishlistDrawer.setAttribute('aria-hidden', 'true'); }
  document.getElementById('wishlistBtn').addEventListener('click', openWishlist);
  document.getElementById('mobileWishlist').addEventListener('click', (e) => { e.preventDefault(); closeMobileMenu(); openWishlist(); });
  document.getElementById('wishlistClose').addEventListener('click', closeWishlist);
  wishlistOverlay.addEventListener('click', closeWishlist);

  /* ---------- Countdown timer ---------- */
  function startCountdown() {
    // Counts down to the next midnight (local time) — demo "ends today"
    function getTarget() {
      const t = new Date();
      t.setHours(24, 0, 0, 0);
      return t;
    }
    let target = getTarget();
    function tick() {
      const now = new Date();
      let diff = target - now;
      if (diff <= 0) { target = getTarget(); diff = target - now; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cdHours').textContent = pad2(h);
      document.getElementById('cdMinutes').textContent = pad2(m);
      document.getElementById('cdSeconds').textContent = pad2(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Toasts ---------- */
  function showToast(message, icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  /* ---------- Newsletter ---------- */
  document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('عضویت شما با موفقیت ثبت شد', 'fa-envelope-circle-check');
    e.target.reset();
  });

  /* ---------- Search (demo filter across name) ---------- */
  document.getElementById('searchBtn').addEventListener('click', doSearch);
  document.getElementById('searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
  function doSearch() {
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    setFilter('all');
    document.querySelectorAll('#productGrid .product-card').forEach(card => {
      const title = card.querySelector('h3').textContent;
      card.classList.toggle('hidden-item', !title.includes(q));
    });
    showToast(`نتایج جستجو برای «${q}»`, 'fa-magnifying-glass');
  }

  /* ---------- Header scroll shadow + scroll progress + scroll-to-top ---------- */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 8);
    scrollTopBtn.classList.toggle('show', scrollY > 500);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  function setupReveal() {
    const items = document.querySelectorAll('.reveal:not(.in-view)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(item => io.observe(item));
  }

  /* ---------- Tile divider (signature motif) ---------- */
  function buildTileDivider() {
    const divider = document.getElementById('tileDivider');
    let html = '';
    for (let i = 0; i < 24; i++) {
      html += `<span style="animation-delay:${(i * 0.15).toFixed(2)}s"></span>`;
    }
    divider.innerHTML = html;
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    renderDeals();
    renderCartDrawer();
    renderWishlistDrawer();
    updateCounts();
    startCountdown();
    buildTileDivider();
    setupReveal();
    onScroll();
  });
})();
