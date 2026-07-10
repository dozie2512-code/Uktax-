/* ====================================================
   Night Buy — Single-Entry SPA
   Hash-based router + auth + all view logic
   ==================================================== */
(function () {
  'use strict';

  /* ===================== Auth ===================== */
  var AUTH_KEY = 'nb_session';

  function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (e) { return null; }
  }

  function setSession(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem(AUTH_KEY);
  }

  function getRoleHome(role) {
    var map = { buyer: 'buyer', vendor: 'vendor', affiliate: 'commissions', partner: 'commissions' };
    return map[(role || '').toLowerCase()] || 'dashboard';
  }

  /* =================== Router ==================== */
  var PROTECTED        = ['dashboard', 'buyer', 'vendor', 'commissions', 'settings'];
  var LANDING_SECTIONS = ['vendors', 'buyers', 'pricing', 'about', 'innovations', 'contact'];

  function getRoute() {
    var h = location.hash.replace(/^#/, '').trim();
    return h || 'home';
  }

  function navigate(route) {
    location.hash = route;
  }

  function logout() {
    clearSession();
    navigate('login');
  }

  // Expose public API
  window.NB = { navigate: navigate, logout: logout };

  function router() {
    var route = getRoute();
    var session = getSession();

    // Already logged in → skip login, go to role home
    if (route === 'login' && session) {
      navigate(getRoleHome(session.role));
      return;
    }

    // Protected route + no session → login
    if (PROTECTED.indexOf(route) !== -1 && !session) {
      navigate('login');
      return;
    }

    // Landing section anchors (e.g. #vendors, #buyers, #pricing, #about)
    if (LANDING_SECTIONS.indexOf(route) !== -1) {
      renderView('home', session);
      requestAnimationFrame(function () {
        var el = document.getElementById(route);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    renderView(route, session);
  }

  /* =================== View rendering =================== */
  function renderView(route, session) {
    var landingNav  = document.getElementById('landing-nav');
    var viewHome    = document.getElementById('view-home');
    var viewLogin   = document.getElementById('view-login');
    var dashShell   = document.getElementById('dash-shell');
    var mainFooter  = document.getElementById('main-footer');

    // Hide all
    landingNav.style.display = 'none';
    viewHome.style.display   = 'none';
    viewLogin.style.display  = 'none';
    dashShell.style.display  = 'none';
    mainFooter.style.display = 'none';

    if (route === 'home') {
      landingNav.style.display = '';
      viewHome.style.display   = '';
      mainFooter.style.display = '';
      initLanding();
    } else if (route === 'login') {
      viewLogin.style.display  = '';
      renderLogin();
    } else if (PROTECTED.indexOf(route) !== -1) {
      dashShell.style.display = 'flex';
      renderDashShell(route, session);
    } else {
      // Unknown route → home
      navigate('home');
    }
  }

  /* =================== Dashboard shell =================== */
  var NAV_ITEMS = [
    { route: 'dashboard',   icon: '🏠', label: 'Overview' },
    { route: 'buyer',       icon: '🛒', label: 'Buy Deals' },
    { route: 'vendor',      icon: '📦', label: 'Vendor' },
    { route: 'commissions', icon: '💰', label: 'Commissions' },
    { route: 'settings',    icon: '⚙️', label: 'Settings' },
  ];

  var PAGE_TITLES = {
    dashboard:   'Dashboard Overview',
    buyer:       'Browse Deals',
    vendor:      'Vendor Dashboard',
    commissions: 'Commissions & Referrals',
    settings:    'Account Settings',
  };

  function renderDashShell(route, session) {
    var navHtml = NAV_ITEMS.map(function (item) {
      return '<a href="#' + item.route + '" class="' + (item.route === route ? 'active' : '') + '">' +
        '<span aria-hidden="true">' + item.icon + '</span>' +
        '<span>' + item.label + '</span>' +
        '</a>';
    }).join('');

    var sidebar = document.getElementById('sidebar');
    sidebar.innerHTML =
      '<div class="sidebar-header">' +
        '<a href="#home" class="sidebar-logo">' +
          '<span class="sidebar-logo-badge">NB</span>Night Buy' +
        '</a>' +
      '</div>' +
      '<nav class="sidebar-nav" aria-label="Dashboard navigation">' + navHtml + '</nav>' +
      '<div class="sidebar-footer">' +
        '<div class="sidebar-user-email" title="' + esc(session.email) + '">' + esc(session.email) + '</div>' +
        '<button class="btn-logout" id="sidebar-logout-btn">Sign Out</button>' +
      '</div>';

    // Attach logout listener after innerHTML is set
    var sidebarLogoutBtn = sidebar.querySelector('#sidebar-logout-btn');
    if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', logout);

    document.getElementById('dash-page-title').textContent = PAGE_TITLES[route] || 'Dashboard';

    var roleInitial = (session.role || 'U')[0].toUpperCase();
    var userInfoEl = document.getElementById('dash-user-info');
    userInfoEl.innerHTML = '';
    var topbarUser = document.createElement('div');
    topbarUser.className = 'topbar-user';
    var badgeSpan = document.createElement('span');
    badgeSpan.className = 'user-badge';
    badgeSpan.setAttribute('aria-hidden', 'true');
    badgeSpan.textContent = roleInitial;
    var nameSpan = document.createElement('span');
    nameSpan.textContent = session.name || session.email;
    var signOutBtn = document.createElement('button');
    signOutBtn.className = 'btn-sm btn-outline';
    signOutBtn.style.border = '1px solid var(--line-strong)';
    signOutBtn.textContent = 'Sign Out';
    signOutBtn.addEventListener('click', logout);
    topbarUser.appendChild(badgeSpan);
    topbarUser.appendChild(nameSpan);
    topbarUser.appendChild(signOutBtn);
    userInfoEl.appendChild(topbarUser);

    // Inject view content
    var content = document.getElementById('dash-content');
    if (route === 'dashboard')   content.innerHTML = getDashboardHtml(session);
    if (route === 'buyer')       content.innerHTML = getBuyerHtml();
    if (route === 'vendor')      content.innerHTML = getVendorHtml();
    if (route === 'commissions') content.innerHTML = getCommissionsHtml(session);
    if (route === 'settings')    content.innerHTML = getSettingsHtml(session);

    // Init view-specific listeners
    if (route === 'buyer')       initBuyer();
    if (route === 'vendor')      initVendor();
    if (route === 'commissions') initCommissions(session);
    if (route === 'settings')    initSettings(session);

    // Mobile sidebar toggle
    var toggle  = document.getElementById('sidebar-toggle');
    var overlay = document.getElementById('sidebar-overlay');
    var sideEl  = document.getElementById('sidebar');

    if (toggle) {
      toggle.onclick = function () {
        sideEl.classList.toggle('open');
        overlay.classList.toggle('show');
      };
    }
    if (overlay) {
      overlay.onclick = function () {
        sideEl.classList.remove('open');
        overlay.classList.remove('show');
      };
    }
  }

  /* =================== Login =================== */
  function renderLogin() {
    document.getElementById('view-login').innerHTML =
      '<div class="login-page">' +
        '<div class="login-card">' +
          '<a href="#home" class="login-logo">' +
            '<span class="login-logo-badge">NB</span>Night Buy' +
          '</a>' +
          '<h2>Welcome back</h2>' +
          '<p class="login-sub">Sign in to your Night Buy account</p>' +
          '<form class="login-form" id="login-form" novalidate>' +
            '<div class="form-group">' +
              '<label for="login-email">Email address</label>' +
              '<input type="email" id="login-email" name="email" placeholder="you@example.com" autocomplete="email" />' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="login-password">Password</label>' +
              '<input type="password" id="login-password" name="password" placeholder="min 4 characters" autocomplete="current-password" />' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="login-role">Sign in as</label>' +
              '<select id="login-role" name="role">' +
                '<option value="">Select your role</option>' +
                '<option value="buyer">Buyer</option>' +
                '<option value="vendor">Vendor</option>' +
                '<option value="affiliate">Partner / Affiliate</option>' +
              '</select>' +
            '</div>' +
            '<label class="login-remember">' +
              '<input type="checkbox" id="login-remember" />Remember me' +
            '</label>' +
            '<div id="login-error" style="display:none" role="alert"></div>' +
            '<button type="submit" class="login-submit">Sign In</button>' +
          '</form>' +
          '<a href="#home" class="login-back">← Back to Night Buy</a>' +
        '</div>' +
      '</div>';

    document.getElementById('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var email    = document.getElementById('login-email').value.trim();
      var password = document.getElementById('login-password').value;
      var role     = document.getElementById('login-role').value;
      var remember = document.getElementById('login-remember').checked;

      if (!email)                          { showLoginError('Please enter your email address.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showLoginError('Please enter a valid email address.'); return; }
      if (!password)                       { showLoginError('Please enter your password.'); return; }
      if (password.length < 4)             { showLoginError('Password must be at least 4 characters.'); return; }
      if (!role)                           { showLoginError('Please select your role.'); return; }

      var session = {
        email:    email,
        role:     role,
        name:     email.split('@')[0],
        remember: remember,
        ts:       Date.now(),
      };
      setSession(session);
      navigate(getRoleHome(role));
    });
  }

  function showLoginError(msg) {
    var el = document.getElementById('login-error');
    if (el) { el.className = 'form-msg-error'; el.textContent = msg; el.style.display = ''; }
  }

  /* =================== Landing init =================== */
  function initLanding() {
    // Mobile nav toggle
    var menuBtn  = document.getElementById('menuBtn');
    var navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks) {
      var freshBtn = menuBtn.cloneNode(true);
      menuBtn.parentNode.replaceChild(freshBtn, menuBtn);
      freshBtn.addEventListener('click', function () { navLinks.classList.toggle('show'); });
    }

    // Scroll reveal
    var revealEls = document.querySelectorAll('#view-home .reveal');
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('show'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { el.classList.remove('show'); obs.observe(el); });

    // Counter animations
    function animateCount(el, target) {
      var start = 0;
      var step  = target / (1400 / 16);
      function tick() {
        start += step;
        if (start < target) { el.textContent = Math.floor(start).toLocaleString(); requestAnimationFrame(tick); }
        else { el.textContent = target.toLocaleString(); }
      }
      tick();
    }
    var counters = document.querySelectorAll('#view-home .count');
    if (counters.length) {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target, parseInt(entry.target.dataset.target, 10));
            cObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { cObs.observe(c); });
    }

    // Contact form
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
      var freshForm = contactForm.cloneNode(true);
      contactForm.parentNode.replaceChild(freshForm, contactForm);
      freshForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg   = document.getElementById('c-form-msg');
        var name  = document.getElementById('c-name').value.trim();
        var email = document.getElementById('c-email').value.trim();
        var role  = document.getElementById('c-role').value;
        if (!name || !email || !role) { msg.textContent = 'Please complete all required fields.'; return; }
        msg.textContent = 'Thanks ' + name + '! Your ' + role.toLowerCase() + ' account request has been received.';
      });
    }
  }

  /* =================== Dashboard overview =================== */
  function getDashboardHtml(session) {
    var role = (session.role || '').toLowerCase();
    var ctaMap = {
      buyer:     '<a href="#buyer" class="btn-sm btn-primary">Browse Deals →</a>',
      vendor:    '<a href="#vendor" class="btn-sm btn-primary">My Inventory →</a>',
      affiliate: '<a href="#commissions" class="btn-sm btn-primary">My Commissions →</a>',
      partner:   '<a href="#commissions" class="btn-sm btn-primary">My Commissions →</a>',
    };
    var cta = ctaMap[role] || '<a href="#buyer" class="btn-sm btn-primary">Explore Deals →</a>';

    return '<div class="metrics-row">' +
        metricCard('Today\'s Deals', '142', '↑ 12 new this hour') +
        metricCard('Active Vendors', '38', '3 online now') +
        metricCard('Live Auctions', '7', 'Ending soon') +
        metricCard('Waste Saved', '2.1 t', 'This week 🌍') +
      '</div>' +
      '<div class="dash-overview-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.15rem">' +
        '<div class="panel">' +
          '<h3>Welcome back, ' + esc(session.name || 'there') + '! 👋</h3>' +
          '<p style="font-size:.88rem;color:var(--muted);margin-bottom:.9rem">You\'re signed in as <strong>' + esc(session.role) + '</strong>.</p>' +
          cta +
        '</div>' +
        '<div class="panel">' +
          '<h3>Tonight\'s Hot Picks 🔥</h3>' +
          '<ul style="list-style:none;display:flex;flex-direction:column;gap:.45rem;font-size:.86rem">' +
            '<li>🍞 Artisan Bread Bundle — <strong>£5.99</strong> <span style="color:#2e7d32;font-size:.73rem;font-weight:700">–59%</span></li>' +
            '<li>🥩 Butcher\'s End-of-Day Box — <strong>£12.99</strong> <span style="color:#2e7d32;font-size:.73rem;font-weight:700">–62%</span></li>' +
            '<li>🌿 Organic Veg Bundle — <strong>£4.49</strong> <span style="color:#2e7d32;font-size:.73rem;font-weight:700">–54%</span></li>' +
            '<li>🍱 Sushi Surplus Pack — <strong>£8.49</strong> <span style="color:#2e7d32;font-size:.73rem;font-weight:700">–68%</span></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Recent Platform Activity</h3>' +
        '<div style="overflow-x:auto">' +
          '<table class="data-table">' +
            '<thead><tr><th>Time</th><th>Event</th><th>Category</th><th>Value</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>2 min ago</td><td>Flash auction started</td><td>Bakery</td><td>£4.99</td></tr>' +
              '<tr><td>8 min ago</td><td>Mystery bundle claimed</td><td>Deli</td><td>£11.99</td></tr>' +
              '<tr><td>15 min ago</td><td>New vendor listing</td><td>Produce</td><td>£3.49</td></tr>' +
              '<tr><td>24 min ago</td><td>Group buy completed</td><td>Seafood</td><td>£24.00</td></tr>' +
              '<tr><td>31 min ago</td><td>Flash auction ended</td><td>Bakery</td><td>£7.50</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function metricCard(label, value, sub) {
    return '<div class="metric-card">' +
      '<div class="metric-label">' + label + '</div>' +
      '<div class="metric-value">' + value + '</div>' +
      '<div class="metric-sub">' + sub + '</div>' +
    '</div>';
  }

  /* =================== Buyer =================== */
  var PRODUCTS = [
    { id:1,  name:'Artisan Bread Bundle',    cat:'Bakery',   price:5.99,  orig:14.50, disc:59, tag:'Flash Auction',  emoji:'🍞' },
    { id:2,  name:'Organic Salad Mix',       cat:'Produce',  price:3.49,  orig:7.99,  disc:56, tag:'Deal',           emoji:'🥗' },
    { id:3,  name:"Butcher's Box",           cat:'Meat',     price:12.99, orig:34.00, disc:62, tag:'Deal',           emoji:'🥩' },
    { id:4,  name:'Sushi Surplus Pack',      cat:'Asian',    price:8.49,  orig:26.99, disc:69, tag:'Flash Auction',  emoji:'🍱' },
    { id:5,  name:'Mystery Veg Bundle',      cat:'Produce',  price:4.49,  orig:9.80,  disc:54, tag:'Mystery Bundle', emoji:'🎁' },
    { id:6,  name:'Bakery Pastry Box',       cat:'Bakery',   price:6.99,  orig:18.00, disc:61, tag:'Deal',           emoji:'🥐' },
    { id:7,  name:'Deli Cheese Selection',   cat:'Deli',     price:9.49,  orig:22.50, disc:58, tag:'Deal',           emoji:'🧀' },
    { id:8,  name:'Seafood Night Box',       cat:'Seafood',  price:14.99, orig:38.00, disc:61, tag:'Flash Auction',  emoji:'🦞' },
    { id:9,  name:'Mystery Bakery Surprise', cat:'Bakery',   price:3.99,  orig:12.00, disc:67, tag:'Mystery Bundle', emoji:'🎁' },
    { id:10, name:'Farm Fresh Eggs (30)',    cat:'Dairy',    price:5.49,  orig:9.99,  disc:45, tag:'Deal',           emoji:'🥚' },
    { id:11, name:'Smoked Salmon Ends',      cat:'Seafood',  price:7.49,  orig:16.00, disc:53, tag:'Deal',           emoji:'🐟' },
    { id:12, name:'Asian Noodle Boxes',      cat:'Asian',    price:4.99,  orig:13.50, disc:63, tag:'Flash Auction',  emoji:'🍜' },
  ];

  var cart = {};

  function getBuyerHtml() {
    var cats = ['All'].concat(PRODUCTS.map(function (p) { return p.cat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    var catOpts = cats.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');

    var allCards = PRODUCTS.map(function (p) { return productCardHtml(p); }).join('');

    var flashCards = PRODUCTS.filter(function (p) { return p.tag === 'Flash Auction'; }).map(function (p) {
      return '<div class="product-card">' +
        '<div class="product-card-img">' + p.emoji + '</div>' +
        '<div class="product-card-body">' +
          '<span class="product-card-tag">⏱ Flash Auction</span>' +
          '<h4>' + esc(p.name) + '</h4>' +
          '<div class="product-price">' +
            '<span class="price-now">£' + p.price.toFixed(2) + '</span>' +
            '<span class="price-was">£' + p.orig.toFixed(2) + '</span>' +
            '<span class="price-disc">–' + p.disc + '%</span>' +
          '</div>' +
        '</div>' +
        '<div class="product-card-actions">' +
          '<button class="btn-sm btn-primary" data-add="' + p.id + '">Add to Cart</button>' +
        '</div>' +
      '</div>';
    }).join('');

    var mysteryCards = PRODUCTS.filter(function (p) { return p.tag === 'Mystery Bundle'; }).map(function (p) {
      return '<div class="product-card">' +
        '<div class="product-card-img" style="background:linear-gradient(135deg,#e8d5f5,#c9a4e8)">' + p.emoji + '</div>' +
        '<div class="product-card-body">' +
          '<span class="product-card-tag" style="background:rgba(147,51,234,.1);color:#6b21a8;border-color:rgba(147,51,234,.28)">🎁 Mystery Bundle</span>' +
          '<h4>' + esc(p.name) + '</h4>' +
          '<div class="product-price">' +
            '<span class="price-now">£' + p.price.toFixed(2) + '</span>' +
            '<span class="price-was">£' + p.orig.toFixed(2) + '</span>' +
            '<span class="price-disc">–' + p.disc + '%</span>' +
          '</div>' +
          '<p style="font-size:.74rem;color:var(--muted);margin-top:.28rem">Surprise selection from today\'s surplus</p>' +
        '</div>' +
        '<div class="product-card-actions">' +
          '<button class="btn-sm btn-primary" data-add="' + p.id + '">Claim Bundle</button>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<div class="cart-bar" id="cart-bar">' +
        '<span>🛒 Cart: <span id="cart-count" class="cart-count">0</span> items</span>' +
        '<span>Total: <strong id="cart-total">£0.00</strong></span>' +
        '<button class="btn-sm btn-primary" id="checkout-btn" disabled style="opacity:.5;cursor:not-allowed">Checkout</button>' +
      '</div>' +
      '<div class="filter-bar">' +
        '<input type="search" id="search-input" placeholder="Search deals…" aria-label="Search deals" style="flex:1;min-width:150px" />' +
        '<select id="cat-filter" aria-label="Filter by category">' + catOpts + '</select>' +
        '<select id="tag-filter" aria-label="Filter by type">' +
          '<option value="All">All types</option>' +
          '<option value="Deal">Deals</option>' +
          '<option value="Flash Auction">Flash Auctions</option>' +
          '<option value="Mystery Bundle">Mystery Bundles</option>' +
        '</select>' +
      '</div>' +
      '<div id="products-grid" class="products-grid">' + allCards + '</div>' +
      '<p id="no-results" style="display:none;color:var(--muted);text-align:center;padding:2rem;font-weight:600">No deals match your search.</p>' +
      '<div class="section-header" style="margin-top:1.4rem"><h2>⏱ Flash Auctions — Ending Soon</h2></div>' +
      '<div class="products-grid">' + flashCards + '</div>' +
      '<div class="section-header" style="margin-top:.6rem"><h2>🎁 Mystery Bundles</h2></div>' +
      '<div class="products-grid">' + mysteryCards + '</div>';
  }

  function productCardHtml(p) {
    return '<div class="product-card" data-id="' + p.id + '" data-cat="' + p.cat + '" data-tag="' + p.tag + '" data-name="' + p.name.toLowerCase() + '">' +
      '<div class="product-card-img">' + p.emoji + '</div>' +
      '<div class="product-card-body">' +
        '<span class="product-card-tag">' + p.tag + '</span>' +
        '<h4>' + esc(p.name) + '</h4>' +
        '<p style="font-size:.74rem;color:var(--muted);margin-bottom:.32rem">' + p.cat + '</p>' +
        '<div class="product-price">' +
          '<span class="price-now">£' + p.price.toFixed(2) + '</span>' +
          '<span class="price-was">£' + p.orig.toFixed(2) + '</span>' +
          '<span class="price-disc">–' + p.disc + '%</span>' +
        '</div>' +
      '</div>' +
      '<div class="product-card-actions">' +
        '<button class="btn-sm btn-primary" data-add="' + p.id + '">Add to Cart</button>' +
      '</div>' +
    '</div>';
  }

  function initBuyer() {
    cart = {};
    updateCartUI();

    // Delegated click for add-to-cart buttons
    var grid = document.getElementById('dash-content');
    function buyerClickHandler(e) {
      if (!document.getElementById('products-grid')) {
        grid.removeEventListener('click', buyerClickHandler);
        return;
      }
      var btn = e.target.closest('[data-add]');
      if (!btn) return;
      var id = parseInt(btn.dataset.add, 10);
      cart[id] = (cart[id] || 0) + 1;
      updateCartUI();
      var orig = btn.textContent;
      btn.textContent = '✓ Added';
      setTimeout(function () { if (btn.isConnected) btn.textContent = orig; }, 1200);
    }
    grid.addEventListener('click', buyerClickHandler);

    // Filters
    var searchInput = document.getElementById('search-input');
    var catFilter   = document.getElementById('cat-filter');
    var tagFilter   = document.getElementById('tag-filter');

    function filterProducts() {
      var q   = (searchInput ? searchInput.value.toLowerCase() : '');
      var cat = catFilter ? catFilter.value : 'All';
      var tag = tagFilter ? tagFilter.value : 'All';
      var cards = document.querySelectorAll('#products-grid .product-card');
      var shown = 0;
      cards.forEach(function (card) {
        var ok = (!q || card.dataset.name.indexOf(q) !== -1) &&
                 (cat === 'All' || card.dataset.cat === cat) &&
                 (tag === 'All' || card.dataset.tag === tag);
        card.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      var noRes = document.getElementById('no-results');
      if (noRes) noRes.style.display = shown === 0 ? '' : 'none';
    }

    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (catFilter)   catFilter.addEventListener('change', filterProducts);
    if (tagFilter)   tagFilter.addEventListener('change', filterProducts);

    // Checkout
    var checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        var count = Object.values(cart).reduce(function (a, b) { return a + b; }, 0);
        if (!count) return;
        var total = document.getElementById('cart-total').textContent;
        alert('Demo: Order placed for ' + count + ' item(s)!\nTotal: ' + total + '\n\nThank you for your Night Buy purchase! 🎉');
        cart = {};
        updateCartUI();
      });
    }
  }

  function updateCartUI() {
    var count = 0, total = 0;
    for (var id in cart) {
      var p = PRODUCTS.filter(function (x) { return x.id === parseInt(id, 10); })[0];
      if (p) { count += cart[id]; total += p.price * cart[id]; }
    }
    var countEl   = document.getElementById('cart-count');
    var totalEl   = document.getElementById('cart-total');
    var checkoutBtn = document.getElementById('checkout-btn');
    if (countEl)  countEl.textContent  = count;
    if (totalEl)  totalEl.textContent  = '£' + total.toFixed(2);
    if (checkoutBtn) {
      checkoutBtn.disabled      = count === 0;
      checkoutBtn.style.opacity = count === 0 ? '.5' : '1';
      checkoutBtn.style.cursor  = count === 0 ? 'not-allowed' : 'pointer';
    }
  }

  /* =================== Vendor =================== */
  var INVENTORY = [
    { id:1, name:'Croissants (12-pack)',      cat:'Bakery',  status:'active',  qty:24, price:8.99  },
    { id:2, name:'Organic Sourdough Loaves',  cat:'Bakery',  status:'active',  qty:12, price:5.99  },
    { id:3, name:'Mixed Pastry Box',          cat:'Bakery',  status:'pending', qty:6,  price:6.49  },
    { id:4, name:'Smoked Salmon Trims',       cat:'Seafood', status:'active',  qty:18, price:9.49  },
    { id:5, name:'Herb-Roast Chicken',        cat:'Meat',    status:'sold',    qty:0,  price:11.99 },
    { id:6, name:'Cheese & Chutney Gift',     cat:'Deli',    status:'draft',   qty:4,  price:14.99 },
    { id:7, name:'Greek Salad Kit',           cat:'Produce', status:'active',  qty:20, price:4.49  },
    { id:8, name:'Sushi Platter (12pc)',      cat:'Asian',   status:'expired', qty:0,  price:12.99 },
  ];

  var ORDERS = [
    { id:'ORD-1041', item:'Croissants (12-pack)',     buyer:'sarah.m', total:'£17.98', status:'processing', date:'Today 21:14' },
    { id:'ORD-1040', item:'Organic Sourdough Loaves', buyer:'tom.k',   total:'£11.98', status:'processing', date:'Today 20:58' },
    { id:'ORD-1039', item:'Smoked Salmon Trims',      buyer:'lisa.j',  total:'£9.49',  status:'paid',       date:'Today 20:12' },
    { id:'ORD-1038', item:'Greek Salad Kit',          buyer:'alex.b',  total:'£8.98',  status:'paid',       date:'Today 19:45' },
    { id:'ORD-1037', item:'Herb-Roast Chicken',       buyer:'mike.o',  total:'£23.98', status:'paid',       date:'Today 18:30' },
  ];

  function invRowHtml(item) {
    var cap = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    return '<tr>' +
      '<td><strong>' + esc(item.name) + '</strong></td>' +
      '<td>' + esc(item.cat) + '</td>' +
      '<td>' + item.qty + '</td>' +
      '<td>£' + item.price.toFixed(2) + '</td>' +
      '<td><span class="badge badge-' + item.status + '">' + cap + '</span></td>' +
      '<td><button class="btn-sm btn-outline" onclick="alert(\'Demo: Edit listing #' + item.id + '\')">Edit</button></td>' +
    '</tr>';
  }

  function getVendorHtml() {
    var invRows   = INVENTORY.map(invRowHtml).join('');
    var orderRows = ORDERS.map(function (o) {
      var cap = o.status.charAt(0).toUpperCase() + o.status.slice(1);
      return '<tr>' +
        '<td><strong>' + esc(o.id) + '</strong></td>' +
        '<td>' + esc(o.item) + '</td>' +
        '<td>' + esc(o.buyer) + '</td>' +
        '<td><strong>' + esc(o.total) + '</strong></td>' +
        '<td><span class="badge badge-' + o.status + '">' + cap + '</span></td>' +
        '<td>' + esc(o.date) + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="metrics-row">' +
        metricCard('Revenue Today', '£214', '↑ 18% vs yesterday') +
        metricCard('Items Sold', '47', '↑ 8 vs yesterday') +
        metricCard('Pending Pickup', '5', 'Next: 21:30') +
        metricCard('Waste Avoided', '12 kg', 'Great work! 🌍') +
      '</div>' +
      '<div class="panel">' +
        '<div class="section-header">' +
          '<h3>My Inventory</h3>' +
          '<button class="btn-sm btn-primary" id="add-listing-btn">+ Add Listing</button>' +
        '</div>' +
        '<div style="overflow-x:auto">' +
          '<table class="data-table">' +
            '<thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>' +
            '<tbody id="inventory-tbody">' + invRows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      '<div class="panel">' +
        '<h3>Recent Orders</h3>' +
        '<div style="overflow-x:auto">' +
          '<table class="data-table">' +
            '<thead><tr><th>Order</th><th>Item</th><th>Buyer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>' +
            '<tbody>' + orderRows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
      '<div id="add-listing-modal" class="modal-overlay" style="display:none" role="dialog" aria-modal="true" aria-labelledby="add-modal-title">' +
        '<div class="modal-box">' +
          '<div class="modal-header">' +
            '<h3 id="add-modal-title">Add New Listing</h3>' +
            '<button class="modal-close" id="modal-close-btn" aria-label="Close modal">✕</button>' +
          '</div>' +
          '<form class="dash-form" id="add-listing-form">' +
            '<div class="form-group">' +
              '<label for="listing-name">Item Name *</label>' +
              '<input type="text" id="listing-name" placeholder="e.g. Fresh Croissants (6-pack)" required />' +
            '</div>' +
            '<div class="form-row">' +
              '<div class="form-group">' +
                '<label for="listing-cat">Category</label>' +
                '<select id="listing-cat"><option>Bakery</option><option>Produce</option><option>Meat</option><option>Seafood</option><option>Deli</option><option>Dairy</option><option>Asian</option></select>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="listing-qty">Quantity *</label>' +
                '<input type="number" id="listing-qty" min="1" value="1" />' +
              '</div>' +
            '</div>' +
            '<div class="form-row">' +
              '<div class="form-group">' +
                '<label for="listing-price">Price (£) *</label>' +
                '<input type="number" id="listing-price" min="0.01" step="0.01" placeholder="0.00" />' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="listing-orig">Original Price (£)</label>' +
                '<input type="number" id="listing-orig" min="0.01" step="0.01" placeholder="0.00" />' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label for="listing-type">Listing Type</label>' +
              '<select id="listing-type"><option value="Deal">Standard Deal</option><option value="Flash Auction">Flash Auction</option><option value="Mystery Bundle">Mystery Bundle</option></select>' +
            '</div>' +
            '<div id="listing-msg" style="display:none"></div>' +
            '<button type="submit" class="btn-sm btn-primary" style="width:100%;padding:.7rem;font-size:.9rem;border-radius:10px;margin-top:.25rem">Add Listing</button>' +
          '</form>' +
        '</div>' +
      '</div>';
  }

  function initVendor() {
    var addBtn    = document.getElementById('add-listing-btn');
    var modal     = document.getElementById('add-listing-modal');
    var closeBtn  = document.getElementById('modal-close-btn');
    var form      = document.getElementById('add-listing-form');

    if (addBtn)  addBtn.addEventListener('click',  function () { modal.style.display = 'flex'; });
    if (closeBtn) closeBtn.addEventListener('click', function () { modal.style.display = 'none'; });
    if (modal)    modal.addEventListener('click',  function (e) { if (e.target === modal) modal.style.display = 'none'; });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name  = document.getElementById('listing-name').value.trim();
        var qty   = document.getElementById('listing-qty').value;
        var price = document.getElementById('listing-price').value;
        var msgEl = document.getElementById('listing-msg');

        if (!name || !qty || !price) {
          msgEl.className   = 'form-msg-error';
          msgEl.textContent = 'Please fill in Name, Quantity and Price.';
          msgEl.style.display = '';
          return;
        }

        var newItem = {
          id:     INVENTORY.length + 1,
          name:   name,
          cat:    document.getElementById('listing-cat').value,
          status: 'active',
          qty:    parseInt(qty, 10),
          price:  parseFloat(price),
        };
        INVENTORY.push(newItem);

        var tbody = document.getElementById('inventory-tbody');
        if (tbody) tbody.insertAdjacentHTML('beforeend', invRowHtml(newItem));

        msgEl.className   = 'form-msg-success';
        msgEl.textContent = '✓ "' + name + '" added successfully!';
        msgEl.style.display = '';
        form.reset();
        setTimeout(function () { if (modal.isConnected) { modal.style.display = 'none'; msgEl.style.display = 'none'; } }, 1600);
      });
    }
  }

  /* =================== Commissions =================== */
  var LEDGER = [
    { date:'2026-07-09', desc:'Referral — Bakery Hub signup',      amount:12.40, status:'paid'    },
    { date:'2026-07-08', desc:'Referral — Green Grocer signup',    amount:9.80,  status:'paid'    },
    { date:'2026-07-08', desc:'Referral — Fishmonger Pro signup',  amount:15.00, status:'pending' },
    { date:'2026-07-07', desc:'Referral — Urban Deli signup',      amount:12.40, status:'paid'    },
    { date:'2026-07-06', desc:'Referral — Cheese Room signup',     amount:12.40, status:'paid'    },
    { date:'2026-07-05', desc:'Referral — Sushi Spot signup',      amount:18.00, status:'pending' },
    { date:'2026-07-04', desc:"Referral — Butcher's Guild signup", amount:12.40, status:'paid'    },
  ];

  function getCommissionsHtml(session) {
    var refCode = (session.name || 'user').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'user';
    var refLink = 'https://nightbuy.app/join?ref=' + refCode;

    var ledgerRows = LEDGER.map(function (r) {
      var cap = r.status.charAt(0).toUpperCase() + r.status.slice(1);
      return '<tr>' +
        '<td>' + r.date + '</td>' +
        '<td>' + esc(r.desc) + '</td>' +
        '<td><strong>£' + r.amount.toFixed(2) + '</strong></td>' +
        '<td><span class="badge badge-' + r.status + '">' + cap + '</span></td>' +
      '</tr>';
    }).join('');

    return '<div class="metrics-row">' +
        metricCard('Total Commissions', '£104.40', '↑ All time') +
        metricCard('Pending Payout',    '£33.00',  '2 pending entries') +
        metricCard('Paid to Date',      '£71.40',  '5 completed') +
        metricCard('Conversion Rate',   '14%',     '↑ Above average') +
      '</div>' +
      '<div class="panel">' +
        '<h3>Your Referral Link</h3>' +
        '<p style="font-size:.87rem;color:var(--muted);margin-bottom:.75rem">Share your unique link to earn commissions on every signup and sale.</p>' +
        '<div class="referral-box">' +
          '<span class="referral-link" id="ref-link-text">' + esc(refLink) + '</span>' +
          '<button class="btn-sm btn-primary" id="copy-ref-btn" aria-label="Copy referral link">Copy</button>' +
        '</div>' +
        '<p id="copy-msg" style="display:none;color:#2e7d32;font-size:.81rem;font-weight:700;margin-top:.45rem" role="status">✓ Copied to clipboard!</p>' +
      '</div>' +
      '<div class="panel">' +
        '<div class="section-header">' +
          '<h3>Commission Ledger</h3>' +
          '<div id="payout-area"><button class="btn-sm btn-primary" id="payout-btn">Request Payout (£33.00)</button></div>' +
        '</div>' +
        '<div style="overflow-x:auto">' +
          '<table class="data-table">' +
            '<thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>' +
            '<tbody>' + ledgerRows + '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  function initCommissions() {
    var copyBtn  = document.getElementById('copy-ref-btn');
    var copyMsg  = document.getElementById('copy-msg');
    var refText  = document.getElementById('ref-link-text');

    if (copyBtn && refText) {
      copyBtn.addEventListener('click', function () {
        var link = refText.textContent;
        var done = function () {
          if (copyMsg) copyMsg.style.display = '';
          copyBtn.textContent = '✓ Copied!';
          setTimeout(function () {
            if (copyMsg) copyMsg.style.display = 'none';
            copyBtn.textContent = 'Copy';
          }, 2200);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(done).catch(function () { fallbackCopy(link); done(); });
        } else {
          fallbackCopy(link);
          done();
        }
      });
    }

    var payoutBtn  = document.getElementById('payout-btn');
    var payoutArea = document.getElementById('payout-area');
    if (payoutBtn && payoutArea) {
      payoutBtn.addEventListener('click', function () {
        payoutArea.innerHTML =
          '<div style="display:flex;align-items:center;gap:.55rem;flex-wrap:wrap">' +
            '<span class="form-msg-success" style="margin:0">✓ Payout request of <strong>£33.00</strong> submitted!</span>' +
            '<span style="font-size:.78rem;color:var(--muted)">Processing 2–3 business days</span>' +
          '</div>';
      });
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* silent */ }
    document.body.removeChild(ta);
  }

  /* =================== Settings =================== */
  function getSettingsHtml(session) {
    return '<div class="settings-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">' +
      '<div>' +
        '<div class="panel">' +
          '<h3>Profile Information</h3>' +
          '<form class="dash-form" id="profile-form">' +
            '<div class="form-group"><label for="s-name">Display Name</label><input type="text" id="s-name" value="' + esc(session.name || '') + '" placeholder="Your name" /></div>' +
            '<div class="form-group"><label for="s-email">Email</label><input type="email" id="s-email" value="' + esc(session.email || '') + '" placeholder="your@email.com" /></div>' +
            '<div class="form-group"><label for="s-phone">Phone (optional)</label><input type="tel" id="s-phone" placeholder="+44 7700 000000" /></div>' +
            '<div class="form-group"><label for="s-location">Location</label><input type="text" id="s-location" placeholder="City, Postcode" /></div>' +
            '<div id="profile-msg" style="display:none"></div>' +
            '<button type="submit" class="btn-sm btn-primary" style="width:100%;padding:.68rem;border-radius:10px;font-size:.9rem">Save Profile</button>' +
          '</form>' +
        '</div>' +
        '<div class="panel">' +
          '<h3>Payout Details</h3>' +
          '<form class="dash-form" id="payout-form">' +
            '<div class="form-group"><label for="s-bank">Bank Name</label><input type="text" id="s-bank" placeholder="e.g. Barclays" /></div>' +
            '<div class="form-group"><label for="s-sort">Sort Code</label><input type="text" id="s-sort" placeholder="00-00-00" /></div>' +
            '<div class="form-group"><label for="s-account">Account Number</label><input type="text" id="s-account" placeholder="12345678" /></div>' +
            '<div id="payout-detail-msg" style="display:none"></div>' +
            '<button type="submit" class="btn-sm btn-primary" style="width:100%;padding:.68rem;border-radius:10px;font-size:.9rem">Save Payout Details</button>' +
          '</form>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="panel">' +
          '<h3>Notification Preferences</h3>' +
          notifToggle('notif-flash',    'Flash Auction Alerts',  'Notify me when flash auctions go live', true) +
          notifToggle('notif-deals',    'New Deal Alerts',       'New deals in my area', true) +
          notifToggle('notif-orders',   'Order Updates',         'Updates on my orders and pickups', true) +
          notifToggle('notif-referrals','Referral Notifications','When someone uses my referral link', false) +
          notifToggle('notif-platform', 'Platform News',         'Night Buy updates and tips', false) +
          notifToggle('notif-email',    'Email Digest',          'Weekly summary via email', true) +
          '<div id="notif-msg" style="display:none;margin-top:.75rem"></div>' +
          '<button class="btn-sm btn-primary" id="save-notif-btn" style="width:100%;padding:.68rem;border-radius:10px;font-size:.9rem;margin-top:1rem">Save Preferences</button>' +
        '</div>' +
        '<div class="panel">' +
          '<h3>Account</h3>' +
          '<p style="font-size:.86rem;color:var(--muted);margin-bottom:.9rem">Manage your Night Buy account access.</p>' +
          '<div style="display:flex;flex-direction:column;gap:.55rem">' +
            '<button class="btn-sm btn-outline" style="width:100%;padding:.68rem;border-radius:10px;font-size:.88rem;border:1px solid var(--line-strong)" onclick="alert(\'Demo: Password change flow would open here.\')">Change Password</button>' +
            '<button class="btn-sm btn-danger" style="width:100%;padding:.68rem;border-radius:10px;font-size:.88rem" onclick="NB.logout()">Sign Out</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function notifToggle(id, label, desc, checked) {
    return '<div class="toggle-row">' +
      '<div>' +
        '<div class="toggle-label">' + label + '</div>' +
        '<div class="toggle-desc">' + desc + '</div>' +
      '</div>' +
      '<label class="toggle-switch" aria-label="' + esc(label) + '">' +
        '<input type="checkbox" id="' + id + '" ' + (checked ? 'checked' : '') + ' />' +
        '<span class="toggle-track"></span>' +
      '</label>' +
    '</div>';
  }

  function initSettings(session) {
    var profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name  = document.getElementById('s-name').value.trim();
        var email = document.getElementById('s-email').value.trim();
        var msg   = document.getElementById('profile-msg');
        if (!name || !email) {
          msg.className = 'form-msg-error';
          msg.textContent = 'Name and email are required.';
          msg.style.display = '';
          return;
        }
        var sess = getSession();
        if (sess) { sess.name = name; sess.email = email; setSession(sess); }
        msg.className   = 'form-msg-success';
        msg.textContent = '✓ Profile saved!';
        msg.style.display = '';
        setTimeout(function () { if (msg.isConnected) msg.style.display = 'none'; }, 3000);
      });
    }

    var payoutForm = document.getElementById('payout-form');
    if (payoutForm) {
      payoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('payout-detail-msg');
        msg.className   = 'form-msg-success';
        msg.textContent = '✓ Payout details saved!';
        msg.style.display = '';
        setTimeout(function () { if (msg.isConnected) msg.style.display = 'none'; }, 3000);
      });
    }

    var saveNotif = document.getElementById('save-notif-btn');
    if (saveNotif) {
      saveNotif.addEventListener('click', function () {
        var msg = document.getElementById('notif-msg');
        msg.className   = 'form-msg-success';
        msg.textContent = '✓ Notification preferences saved!';
        msg.style.display = '';
        setTimeout(function () { if (msg.isConnected) msg.style.display = 'none'; }, 3000);
      });
    }
  }

  /* =================== Utilities =================== */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* =================== Bootstrap =================== */
  window.addEventListener('hashchange', router);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', router);
  } else {
    router();
  }
})();
