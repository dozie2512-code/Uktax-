(function () {
  const STORAGE_KEY = 'nb_session';
  const ROUTES = {
    buyer: 'dashboard/buyer.html',
    vendor: 'dashboard/vendor.html',
    partner: 'dashboard/commissions.html'
  };

  const getSession = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : null;
    } catch (_e) {
      return null;
    }
  };

  const setSession = (session) => localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  const clearSession = () => localStorage.removeItem(STORAGE_KEY);

  const isDashboardPath = () => window.location.pathname.includes('/dashboard/');
  const asPagePath = (target) => (isDashboardPath() ? `../${target}` : target);

  const normalizeRole = (role) => {
    const value = String(role || '').toLowerCase().trim();
    if (value.startsWith('buyer')) return 'buyer';
    if (value.startsWith('vendor')) return 'vendor';
    if (value.startsWith('partner')) return 'partner';
    return '';
  };

  const roleHome = (role) => ROUTES[normalizeRole(role)] || 'dashboard/index.html';
  const redirectToRoleHome = (role) => window.location.assign(asPagePath(roleHome(role)));

  const byId = (id) => document.getElementById(id);
  const setMessage = (el, text, kind) => {
    if (!el) return;
    el.textContent = text || '';
    el.className = text ? `message ${kind}` : '';
    if (!text) el.removeAttribute('class');
  };

  const applyPageAccess = () => {
    if (!isDashboardPath()) return true;

    const session = getSession();
    if (!session) {
      window.location.assign(asPagePath('login.html'));
      return false;
    }

    const userChip = document.querySelector('[data-user-chip]');
    if (userChip) {
      userChip.textContent = `${session.email} (${session.role})`;
    }

    const requiredRole = normalizeRole(document.body.getAttribute('data-required-role'));
    const sessionRole = normalizeRole(session.role);
    if (requiredRole && sessionRole && requiredRole !== sessionRole) {
      sessionStorage.setItem('nb_notice', `Redirected to your ${session.role} dashboard.`);
      redirectToRoleHome(session.role);
      return false;
    }

    document.querySelectorAll('[data-action="logout"]').forEach((button) => {
      button.addEventListener('click', () => {
        clearSession();
        window.location.assign(asPagePath('login.html'));
      });
    });

    const sidebar = document.querySelector('.sidebar');
    document.querySelectorAll('[data-action="toggle-menu"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (sidebar) sidebar.classList.toggle('open');
      });
    });

    const notice = sessionStorage.getItem('nb_notice');
    const noticeEl = byId('page-notice');
    if (noticeEl && notice) {
      setMessage(noticeEl, notice, 'success');
      sessionStorage.removeItem('nb_notice');
    }

    return true;
  };

  const initLogin = () => {
    if (!document.body.classList.contains('login-page')) return;
    const existing = getSession();
    if (existing) {
      redirectToRoleHome(existing.role);
      return;
    }

    const form = byId('login-form');
    const emailEl = byId('email');
    const passwordEl = byId('password');
    const roleEl = byId('role');
    const rememberEl = byId('rememberMe');
    const msgEl = byId('login-message');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = (emailEl.value || '').trim();
      const password = passwordEl.value || '';
      const role = normalizeRole(roleEl.value);

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setMessage(msgEl, 'Enter a valid email address.', 'error');
        emailEl.focus();
        return;
      }
      if (password.length < 6) {
        setMessage(msgEl, 'Password must be at least 6 characters.', 'error');
        passwordEl.focus();
        return;
      }
      if (!role) {
        setMessage(msgEl, 'Select a role to continue.', 'error');
        roleEl.focus();
        return;
      }

      setSession({
        email,
        role,
        remember: !!rememberEl.checked,
        loginAt: new Date().toISOString()
      });

      setMessage(msgEl, 'Login successful. Redirecting...', 'success');
      window.setTimeout(() => redirectToRoleHome(role), 250);
    });
  };

  const initBuyer = () => {
    if (!document.body.classList.contains('buyer-page')) return;

    const deals = [
      { name: 'Bakery Saver Box', category: 'Bakery', mode: 'Flash Auction', price: 12.4, discount: '35%' },
      { name: 'Fresh Produce Crate', category: 'Groceries', mode: 'Mystery Bundle', price: 18.0, discount: '42%' },
      { name: 'Seafood Night Pack', category: 'Seafood', mode: 'Flash Auction', price: 24.9, discount: '28%' },
      { name: 'Cafe Closing Bundle', category: 'Prepared Meals', mode: 'Mystery Bundle', price: 9.8, discount: '47%' },
      { name: 'Fruit Rescue Mix', category: 'Groceries', mode: 'Flash Auction', price: 7.5, discount: '31%' }
    ];

    const state = { cartCount: 0, cartTotal: 0 };

    const renderTotals = () => {
      byId('cart-count').textContent = String(state.cartCount);
      byId('cart-total').textContent = `£${state.cartTotal.toFixed(2)}`;
    };

    const renderDeals = () => {
      const category = byId('deal-category').value;
      const query = (byId('deal-search').value || '').trim().toLowerCase();
      const list = byId('deal-list');

      const filtered = deals.filter((deal) => {
        const matchesCategory = category === 'All' || deal.category === category;
        const text = `${deal.name} ${deal.category} ${deal.mode}`.toLowerCase();
        return matchesCategory && (!query || text.includes(query));
      });

      list.innerHTML = filtered.map((deal, index) => `
        <article class="deal-card">
          <h3>${deal.name}</h3>
          <div class="deal-meta"><span class="badge neutral">${deal.category}</span><strong>£${deal.price.toFixed(2)}</strong></div>
          <div class="deal-meta"><span>${deal.mode}</span><span>-${deal.discount}</span></div>
          <button class="btn" type="button" data-add="${index}">Add</button>
        </article>
      `).join('') || '<p class="notice">No deals match your filter.</p>';

      list.querySelectorAll('[data-add]').forEach((button) => {
        button.addEventListener('click', () => {
          const selected = filtered[Number(button.getAttribute('data-add'))];
          if (!selected) return;
          state.cartCount += 1;
          state.cartTotal += selected.price;
          renderTotals();
        });
      });
    };

    byId('deal-category').addEventListener('change', renderDeals);
    byId('deal-search').addEventListener('input', renderDeals);

    renderTotals();
    renderDeals();
  };

  const initVendor = () => {
    if (!document.body.classList.contains('vendor-page')) return;

    const inventory = [
      { item: 'Sourdough Family Loaf', stock: 14, status: 'Live' },
      { item: 'Sushi Combo', stock: 5, status: 'Pending Pickup' },
      { item: 'Fruit Tart', stock: 8, status: 'Draft' }
    ];

    const statusBadge = (status) => {
      if (status === 'Live') return 'success';
      if (status === 'Pending Pickup') return 'warning';
      if (status === 'Draft') return 'neutral';
      return 'danger';
    };

    const renderInventory = () => {
      byId('vendor-inventory').innerHTML = inventory.map((row) => `
        <tr>
          <td>${row.item}</td>
          <td>${row.stock}</td>
          <td><span class="badge ${statusBadge(row.status)}">${row.status}</span></td>
        </tr>
      `).join('');
    };

    const form = byId('vendor-add-form');
    const msg = byId('vendor-message');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = byId('listing-name').value.trim();
      const stock = Number(byId('listing-stock').value);
      const status = byId('listing-status').value;
      if (!name || !stock || !status) {
        setMessage(msg, 'Fill all listing fields.', 'error');
        return;
      }
      inventory.unshift({ item: name, stock, status });
      renderInventory();
      form.reset();
      setMessage(msg, 'Listing added to demo inventory.', 'success');
    });

    renderInventory();
  };

  const initCommissions = () => {
    if (!document.body.classList.contains('commissions-page')) return;

    const referralEl = byId('referral-link');
    const referralMsg = byId('referral-message');

    byId('generate-referral').addEventListener('click', () => {
      const code = Math.random().toString(36).slice(2, 9).toUpperCase();
      referralEl.value = `https://nightbuy.app/r/${code}`;
      setMessage(referralMsg, 'Referral link generated.', 'success');
    });

    byId('copy-referral').addEventListener('click', async () => {
      if (!referralEl.value) {
        setMessage(referralMsg, 'Generate a referral link first.', 'error');
        return;
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(referralEl.value);
        } else {
          referralEl.select();
          document.execCommand('copy');
        }
        setMessage(referralMsg, 'Referral link copied.', 'success');
      } catch (_e) {
        setMessage(referralMsg, 'Copy failed. Please copy manually.', 'error');
      }
    });

    byId('request-payout').addEventListener('click', (event) => {
      event.currentTarget.disabled = true;
      byId('payout-state').textContent = 'Payout request submitted. Demo confirmation sent.';
    });
  };

  const initSettings = () => {
    if (!document.body.classList.contains('settings-page')) return;
    const form = byId('settings-form');
    const msg = byId('settings-message');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      setMessage(msg, 'Settings saved successfully (demo).', 'success');
    });
  };

  const initDashboardIndex = () => {
    if (!document.body.classList.contains('dashboard-home')) return;
    const session = getSession();
    const roleEl = byId('role-home-link');
    if (!roleEl || !session) return;
    roleEl.href = roleHome(session.role).replace('dashboard/', '');
    roleEl.textContent = `${session.role.charAt(0).toUpperCase()}${session.role.slice(1)} workspace`;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const accessOk = applyPageAccess();
    if (accessOk === false) return;
    initLogin();
    initDashboardIndex();
    initBuyer();
    initVendor();
    initCommissions();
    initSettings();
  });
})();
