(function () {
  const STORAGE_KEY = 'nightbuy.session';
  const NOTICE_KEY = 'nightbuy.notice';
  const CART_KEY = 'nightbuy.cart';
  const ROLE_LABELS = {
    buyer: 'Buyer',
    vendor: 'Vendor',
    partner: 'Partner/Affiliate'
  };
  const ROLE_ROUTES = {
    buyer: 'dashboard/buyer.html',
    vendor: 'dashboard/vendor.html',
    partner: 'dashboard/commissions.html'
  };

  const buyerDeals = [
    { id: 1, title: 'Artisan Pastry Rescue Box', category: 'Bakery', price: 8, discount: 64, vendor: 'Golden Crust', mode: 'mystery', blurb: '6 fresh pastries packed at close.' },
    { id: 2, title: 'Late-Night Sushi Set', category: 'Meal', price: 14, discount: 42, vendor: 'Sora Kitchen', mode: 'flash', blurb: '8-piece set with chef surplus rolls.' },
    { id: 3, title: 'Farm Fruit Grab Bag', category: 'Produce', price: 6, discount: 55, vendor: 'Orchard Lane', mode: 'bundle', blurb: 'Seasonal fruit mix for breakfast prep.' },
    { id: 4, title: 'Cheese & Deli Bundle', category: 'Groceries', price: 11, discount: 48, vendor: 'Market Cellar', mode: 'bundle', blurb: 'Curated deli cuts and cheese ends.' },
    { id: 5, title: 'Flash Taco Tray', category: 'Meal', price: 9, discount: 58, vendor: 'Torch Grill', mode: 'flash', blurb: 'Three tacos + sides before kitchen close.' },
    { id: 6, title: 'Mystery Floral Stem Mix', category: 'Lifestyle', price: 12, discount: 50, vendor: 'Petal House', mode: 'mystery', blurb: 'Loose stems rescued from tonight’s display.' }
  ];

  const inventorySeed = [
    { item: 'Sourdough Rescue Box', category: 'Bakery', stock: 18, status: 'active', price: '£7.50' },
    { item: 'Prepared Salad Bundle', category: 'Meal', stock: 10, status: 'pending', price: '£5.80' },
    { item: 'Seasonal Fruit Tray', category: 'Produce', stock: 6, status: 'review', price: '£9.20' },
    { item: 'Chef Surprise Bundle', category: 'Meal', stock: 14, status: 'draft', price: '£12.00' }
  ];

  const commissionLedger = [
    { date: '10 Jul 2026', source: 'Golden Crust referral', order: '#NB-2048', commission: '£42.00', status: 'pending' },
    { date: '09 Jul 2026', source: 'Sora Kitchen upgrade', order: '#NB-2034', commission: '£85.00', status: 'paid' },
    { date: '08 Jul 2026', source: 'Orchard Lane sign-up', order: '#NB-2017', commission: '£26.00', status: 'processing' },
    { date: '07 Jul 2026', source: 'Torch Grill promo', order: '#NB-1994', commission: '£34.00', status: 'paid' }
  ];

  function getBase() {
    return document.body.dataset.base || './';
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || !session.role || !session.email) return null;
      return session;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CART_KEY);
  }

  function setNotice(message, type) {
    sessionStorage.setItem(NOTICE_KEY, JSON.stringify({ message: message, type: type || 'info' }));
  }

  function consumeNotice() {
    const raw = sessionStorage.getItem(NOTICE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(NOTICE_KEY);
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function routeForRole(role, base) {
    return (base || getBase()) + (ROLE_ROUTES[role] || 'dashboard/index.html');
  }

  function showBanner(message, type) {
    const banner = document.querySelector('[data-banner]');
    if (!banner || !message) return;
    banner.textContent = message;
    banner.className = 'notice is-visible ' + (type || 'info');
  }

  function redirect(path) {
    window.location.href = path;
  }

  function logout() {
    clearSession();
    setNotice('You have been logged out.', 'success');
    redirect(getBase() + 'login.html');
  }

  function fillSessionFields(session) {
    document.querySelectorAll('[data-user-email]').forEach((el) => {
      el.textContent = session ? session.email : 'Guest';
    });
    document.querySelectorAll('[data-user-role]').forEach((el) => {
      el.textContent = session ? ROLE_LABELS[session.role] : 'Guest';
    });
  }

  function attachLogout() {
    document.querySelectorAll('[data-logout]').forEach((button) => {
      button.addEventListener('click', logout);
    });
  }

  function initNav() {
    const sidebar = document.querySelector('[data-sidebar]');
    const toggle = document.querySelector('[data-menu-toggle]');
    if (sidebar && toggle) {
      toggle.addEventListener('click', function () {
        sidebar.classList.toggle('is-open');
      });
      sidebar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', function () {
          sidebar.classList.remove('is-open');
        });
      });
    }
  }

  function initGuards() {
    const base = getBase();
    const session = getSession();
    const isLoginPage = document.body.dataset.page === 'login';
    const isProtected = document.body.dataset.protected === 'true';
    const requiredRole = document.body.dataset.role || '';

    const notice = consumeNotice();
    if (notice) showBanner(notice.message, notice.type);

    if (isLoginPage && session) {
      redirect(routeForRole(session.role, base));
      return null;
    }

    if (isProtected && !session) {
      setNotice('Please log in to continue.', 'info');
      redirect(base + 'login.html');
      return null;
    }

    if (session && requiredRole && session.role !== requiredRole) {
      setNotice('That page is tailored for ' + ROLE_LABELS[requiredRole] + '. We redirected you to your role home.', 'info');
      redirect(routeForRole(session.role, base));
      return null;
    }

    fillSessionFields(session);
    return session;
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function setFieldState(field, state, message) {
    field.classList.remove('has-error', 'has-success');
    if (state) field.classList.add(state === 'error' ? 'has-error' : 'has-success');
    const error = field.querySelector('.field-error');
    if (error) error.textContent = message || '';
  }

  function initLoginForm() {
    const form = document.querySelector('[data-login-form]');
    if (!form) return;

    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const emailField = form.querySelector('[data-field="email"]');
      const passwordField = form.querySelector('[data-field="password"]');
      const roleField = form.querySelector('[data-field="role"]');
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      const role = form.role.value;
      const remember = form.remember.checked;
      let valid = true;

      if (!validateEmail(email)) {
        setFieldState(emailField, 'error', 'Enter a valid email address.');
        valid = false;
      } else {
        setFieldState(emailField, 'success');
      }

      if (password.length < 6) {
        setFieldState(passwordField, 'error', 'Use at least 6 characters for this demo sign-in.');
        valid = false;
      } else {
        setFieldState(passwordField, 'success');
      }

      if (!role) {
        setFieldState(roleField, 'error', 'Choose the dashboard you want to preview.');
        valid = false;
      } else {
        setFieldState(roleField, 'success');
      }

      if (!valid) {
        showBanner('Please correct the highlighted fields.', 'error');
        if (status) status.textContent = '';
        return;
      }

      const session = {
        email: email,
        role: role,
        roleLabel: ROLE_LABELS[role],
        remember: remember,
        loggedInAt: new Date().toISOString()
      };
      setSession(session);
      showBanner('Success! Redirecting you to your dashboard…', 'success');
      if (status) status.textContent = 'Demo session saved locally.';
      window.setTimeout(function () {
        redirect(routeForRole(role, getBase()));
      }, 350);
    });
  }

  function initOverview(session) {
    if (document.body.dataset.page !== 'overview' || !session) return;
    const homeLink = document.querySelector('[data-role-home-link]');
    const homeLabel = document.querySelector('[data-role-home-label]');
    const roleSummary = document.querySelector('[data-role-summary]');
    if (homeLink) homeLink.setAttribute('href', routeForRole(session.role, getBase()));
    if (homeLabel) homeLabel.textContent = ROLE_LABELS[session.role] + ' home';
    if (roleSummary) roleSummary.textContent = 'You are signed in as a ' + ROLE_LABELS[session.role] + '. Use the quick links below to jump into tonight’s workflow.';
    document.querySelectorAll('[data-role-link]').forEach((link) => {
      const targetRole = link.dataset.roleLink;
      if (targetRole !== session.role) {
        link.classList.add('hidden');
      }
    });
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function renderBuyerDeals(list) {
    const host = document.querySelector('[data-deals]');
    if (!host) return;
    if (!list.length) {
      host.innerHTML = '<div class="empty-state">No deals match that search yet. Try another category or keyword.</div>';
      return;
    }
    host.innerHTML = list.map(function (deal) {
      const modeLabel = deal.mode === 'flash' ? 'Flash auction' : deal.mode === 'mystery' ? 'Mystery bundle' : 'Bundle';
      return '<article class="deal-card">'
        + '<div class="card-tags"><span class="tag">' + deal.category + '</span><span class="tag">' + modeLabel + '</span></div>'
        + '<div><h3>' + deal.title + '</h3><p>' + deal.blurb + '</p></div>'
        + '<div class="deal-meta"><span>' + deal.vendor + '</span><span>' + deal.discount + '% off</span></div>'
        + '<div class="price-row"><div><strong>£' + deal.price.toFixed(2) + '</strong><small>Tonight only</small></div>'
        + '<button class="btn small" type="button" data-add-deal="' + deal.id + '">Add</button></div>'
        + '</article>';
    }).join('');

    host.querySelectorAll('[data-add-deal]').forEach(function (button) {
      button.addEventListener('click', function () {
        const id = button.getAttribute('data-add-deal');
        const cart = getCart();
        cart[id] = (cart[id] || 0) + 1;
        setCart(cart);
        updateCartSummary();
      });
    });
  }

  function updateCartSummary() {
    const cart = getCart();
    const items = Object.keys(cart).reduce(function (count, key) { return count + cart[key]; }, 0);
    const total = buyerDeals.reduce(function (sum, deal) {
      return sum + ((cart[deal.id] || 0) * deal.price);
    }, 0);
    const savings = buyerDeals.reduce(function (sum, deal) {
      const quantity = cart[deal.id] || 0;
      const originalPrice = deal.price / (1 - deal.discount / 100);
      return sum + ((originalPrice - deal.price) * quantity);
    }, 0);

    const countEl = document.querySelector('[data-cart-count]');
    const totalEl = document.querySelector('[data-cart-total]');
    const savingsEl = document.querySelector('[data-cart-savings]');
    if (countEl) countEl.textContent = String(items);
    if (totalEl) totalEl.textContent = '£' + total.toFixed(2);
    if (savingsEl) savingsEl.textContent = '£' + savings.toFixed(2);
  }

  function initBuyerDemo() {
    if (document.body.dataset.page !== 'buyer') return;
    const form = document.querySelector('[data-deal-filter]');
    if (!form) return;

    function applyFilters() {
      const category = form.category.value;
      const term = form.search.value.trim().toLowerCase();
      const filtered = buyerDeals.filter(function (deal) {
        const categoryMatch = !category || deal.category === category;
        const termMatch = !term || [deal.title, deal.vendor, deal.blurb, deal.mode].join(' ').toLowerCase().indexOf(term) >= 0;
        return categoryMatch && termMatch;
      });
      renderBuyerDeals(filtered);
    }

    form.addEventListener('input', applyFilters);
    form.addEventListener('submit', function (event) { event.preventDefault(); applyFilters(); });
    const reset = form.querySelector('[data-reset-filters]');
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        applyFilters();
      });
    }

    applyFilters();
    updateCartSummary();
  }

  function renderInventory(rows) {
    const tbody = document.querySelector('[data-inventory-body]');
    if (!tbody) return;
    tbody.innerHTML = rows.map(function (row) {
      return '<tr>'
        + '<td><strong>' + row.item + '</strong><br><small>' + row.category + '</small></td>'
        + '<td>' + row.stock + '</td>'
        + '<td>' + row.price + '</td>'
        + '<td><span class="status-badge ' + row.status + '">' + row.status + '</span></td>'
        + '</tr>';
    }).join('');
  }

  function initVendorDemo() {
    if (document.body.dataset.page !== 'vendor') return;
    const form = document.querySelector('[data-listing-form]');
    const toggle = document.querySelector('[data-toggle-listing-form]');
    const status = document.querySelector('[data-listing-status]');
    const inventory = inventorySeed.slice();

    renderInventory(inventory);

    if (toggle && form) {
      toggle.addEventListener('click', function () {
        form.classList.toggle('hidden');
      });
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const item = form.item.value.trim();
        const category = form.category.value;
        const stock = form.stock.value.trim();
        const price = form.price.value.trim();
        if (!item || !category || !stock || !price) {
          if (status) {
            status.className = 'notice is-visible error';
            status.textContent = 'Fill in all listing fields to add a demo row.';
          }
          return;
        }
        inventory.unshift({ item: item, category: category, stock: stock, price: '£' + Number(price).toFixed(2), status: 'draft' });
        renderInventory(inventory);
        form.reset();
        form.classList.add('hidden');
        if (status) {
          status.className = 'notice is-visible success';
          status.textContent = 'Listing added to the demo inventory as a draft.';
        }
      });
    }
  }

  function renderLedger() {
    const tbody = document.querySelector('[data-ledger-body]');
    if (!tbody) return;
    tbody.innerHTML = commissionLedger.map(function (entry) {
      return '<tr>'
        + '<td>' + entry.date + '</td>'
        + '<td><strong>' + entry.source + '</strong><br><small>' + entry.order + '</small></td>'
        + '<td>' + entry.commission + '</td>'
        + '<td><span class="status-badge ' + entry.status + '">' + entry.status + '</span></td>'
        + '</tr>';
    }).join('');
  }

  function initCommissionDemo(session) {
    if (document.body.dataset.page !== 'commissions') return;
    renderLedger();
    const output = document.querySelector('[data-referral-link]');
    const generate = document.querySelector('[data-generate-link]');
    const copy = document.querySelector('[data-copy-link]');
    const payout = document.querySelector('[data-request-payout]');
    const payoutStatus = document.querySelector('[data-payout-status]');

    function buildLink() {
      const seed = (session && session.email ? session.email.split('@')[0] : 'partner').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      return 'https://nightbuy.local/invite/' + seed + '-' + Math.random().toString(36).slice(2, 7);
    }

    if (output) output.value = buildLink();
    if (generate && output) {
      generate.addEventListener('click', function () {
        output.value = buildLink();
        showBanner('New referral link generated.', 'success');
      });
    }
    if (copy && output) {
      copy.addEventListener('click', async function () {
        const text = output.value;
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) {
            throw new Error('Clipboard API unavailable');
          }
          await navigator.clipboard.writeText(text);
          showBanner('Referral link copied to your clipboard.', 'success');
        } catch (error) {
          showBanner('Copy is unavailable here. You can still copy the link manually.', 'info');
        }
      });
    }
    if (payout) {
      payout.addEventListener('click', function () {
        payout.disabled = true;
        if (payoutStatus) {
          payoutStatus.className = 'notice is-visible success';
          payoutStatus.textContent = 'Demo payout request submitted for the next settlement cycle.';
        }
      });
    }
  }

  function initSettings(session) {
    if (document.body.dataset.page !== 'settings') return;
    const form = document.querySelector('[data-settings-form]');
    if (!form) return;
    if (session) {
      form.email.value = session.email;
      form.fullName.value = session.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, function (char) { return char.toUpperCase(); });
      form.role.value = ROLE_LABELS[session.role];
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const status = document.querySelector('[data-settings-status]');
      if (status) {
        status.className = 'notice is-visible success';
        status.textContent = 'Settings saved locally for this demo session.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const session = initGuards();
    initNav();
    attachLogout();
    initLoginForm();
    initOverview(session);
    initBuyerDemo();
    initVendorDemo();
    initCommissionDemo(session);
    initSettings(session);
  });
})();
