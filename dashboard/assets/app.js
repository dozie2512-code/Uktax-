/**
 * Night Buy — Dashboard Shared JavaScript
 * Handles: session management, route guards, logout, utilities
 */

/* ─────────────────────────────────────────────────────
   Session helpers
───────────────────────────────────────────────────── */
const NB = (() => {
  const SESSION_KEY = 'nb_session';

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function setSession(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    const s = getSession();
    return s && s.email;
  }

  /** Returns the relative path to the role's home page */
  function roleHome(role) {
    const map = {
      Buyer: 'buyer.html',
      Vendor: 'vendor.html',
      'Partner/Affiliate': 'commissions.html',
    };
    return map[role] || 'index.html';
  }

  /**
   * Route guard — call at top of each protected dashboard page.
   * Pass the expected role string (or null to allow any logged-in role).
   * Redirects to login.html if not logged in.
   */
  function requireAuth(expectedRole) {
    const s = getSession();
    if (!s || !s.email) {
      window.location.replace('../login.html');
      return null;
    }
    if (expectedRole && s.role !== expectedRole) {
      // Gentle redirect to role home instead of showing an error
      window.location.replace(roleHome(s.role));
      return null;
    }
    return s;
  }

  /** Populate sidebar user block from session */
  function populateSidebar(session) {
    const nameEl = document.getElementById('sidebarName');
    const roleEl = document.getElementById('sidebarRole');
    if (nameEl) nameEl.textContent = session.name || session.email;
    if (roleEl) roleEl.textContent = session.role || 'Member';
  }

  /** Logout — clear session and redirect to login */
  function logout() {
    clearSession();
    window.location.replace('../login.html');
  }

  return { getSession, setSession, clearSession, isLoggedIn, roleHome, requireAuth, populateSidebar, logout };
})();

/* ─────────────────────────────────────────────────────
   DOM ready helper
───────────────────────────────────────────────────── */
function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/* ─────────────────────────────────────────────────────
   Sidebar toggle (mobile)
───────────────────────────────────────────────────── */
onReady(() => {
  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      if (overlay) overlay.style.display = isOpen ? 'block' : 'none';
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('open');
      overlay.style.display = 'none';
    });
  }

  // Logout buttons
  document.querySelectorAll('.js-logout').forEach(btn => {
    btn.addEventListener('click', () => NB.logout());
  });
});

/* ─────────────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────────────── */
function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:1.2rem;right:1.2rem;z-index:999;display:flex;flex-direction:column;gap:.5rem;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = {
    success: '#2d7a44',
    error: '#c0392b',
    warn: '#b5770d',
    info: '#1a6fa0',
  };
  const icons = { success: '✓', error: '✕', warn: '⚠', info: 'ℹ' };
  toast.style.cssText = `
    display:flex;align-items:center;gap:.6rem;
    background:#fff;border:1px solid ${colors[type] || '#ccc'};
    border-left:4px solid ${colors[type] || '#ccc'};
    color:${colors[type] || '#333'};
    padding:.75rem 1rem;border-radius:10px;
    box-shadow:0 8px 24px rgba(0,0,0,.12);
    font-size:.88rem;font-weight:600;
    animation:slideIn .25s ease;
    max-width:320px;
  `;
  toast.innerHTML = `<span>${icons[type] || '●'}</span><span>${message}</span>`;
  container.appendChild(toast);

  const style = document.getElementById('toastStyle');
  if (!style) {
    const s = document.createElement('style');
    s.id = 'toastStyle';
    s.textContent = '@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}';
    document.head.appendChild(s);
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'opacity .3s,transform .3s';
    setTimeout(() => toast.remove(), 310);
  }, duration);
}

/* ─────────────────────────────────────────────────────
   Modal helpers
───────────────────────────────────────────────────── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

onReady(() => {
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.openModal));
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

/* ─────────────────────────────────────────────────────
   Copy to clipboard
───────────────────────────────────────────────────── */
function copyToClipboard(text, successMsg = 'Copied!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(successMsg, 'success'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMsg, 'success');
  }
}

/* ─────────────────────────────────────────────────────
   Demo data helpers
───────────────────────────────────────────────────── */
const DEMO = {
  deals: [
    { id: 1, name: 'Artisan Sourdough Loaf', cat: 'Bakery', emoji: '🍞', price: 1.20, original: 3.50, discount: 66, vendor: 'The Bread Oven', timer: '1h 12m', mode: 'flash' },
    { id: 2, name: 'Mixed Sushi Platter (12pc)', cat: 'Japanese', emoji: '🍱', price: 4.50, original: 12.00, discount: 63, vendor: 'Sakura Kitchen', timer: '45m', mode: 'flash' },
    { id: 3, name: 'Organic Veg Box', cat: 'Produce', emoji: '🥦', price: 3.00, original: 8.50, discount: 65, vendor: 'Green Roots', timer: '2h 05m', mode: 'standard' },
    { id: 4, name: 'Protein Mystery Bundle', cat: 'Bundles', emoji: '🎁', price: 5.00, original: 18.00, discount: 72, vendor: 'FitMarket', timer: '', mode: 'bundle' },
    { id: 5, name: 'Seasonal Fruit Bag', cat: 'Produce', emoji: '🍓', price: 2.00, original: 5.00, discount: 60, vendor: 'City Farm', timer: '3h 20m', mode: 'standard' },
    { id: 6, name: 'Focaccia & Dips Set', cat: 'Bakery', emoji: '🫓', price: 2.50, original: 6.00, discount: 58, vendor: 'The Bread Oven', timer: '55m', mode: 'flash' },
    { id: 7, name: 'Pastry Surprise Box', cat: 'Bundles', emoji: '🧁', price: 4.00, original: 14.00, discount: 71, vendor: 'Sweet Street', timer: '', mode: 'bundle' },
    { id: 8, name: 'Hot Rotisserie Chicken', cat: 'Ready Meals', emoji: '🍗', price: 3.50, original: 8.00, discount: 56, vendor: 'Roast Co.', timer: '30m', mode: 'flash' },
  ],

  vendorInventory: [
    { id: 'V001', name: 'Croissant Tray (×12)', qty: 24, price: '£1.80', status: 'active', sold: 10 },
    { id: 'V002', name: 'Smoked Salmon Bagels (×4)', qty: 8, price: '£3.50', status: 'active', sold: 5 },
    { id: 'V003', name: 'Cinnamon Roll Box', qty: 0, price: '£2.20', status: 'sold_out', sold: 18 },
    { id: 'V004', name: 'Quiche Lorraine Slice', qty: 15, price: '£2.00', status: 'active', sold: 7 },
    { id: 'V005', name: 'Seasonal Fruit Cake', qty: 4, price: '£4.00', status: 'low_stock', sold: 3 },
  ],

  vendorOrders: [
    { id: '#ORD-4821', item: 'Croissant Tray (×12)', buyer: 'Sarah M.', amount: '£3.60', status: 'completed', time: '8 min ago' },
    { id: '#ORD-4820', item: 'Smoked Salmon Bagels', buyer: 'Tom K.', amount: '£3.50', status: 'pending', time: '22 min ago' },
    { id: '#ORD-4819', item: 'Quiche Lorraine Slice', buyer: 'Aisha B.', amount: '£4.00', status: 'completed', time: '41 min ago' },
    { id: '#ORD-4818', item: 'Seasonal Fruit Cake', buyer: 'James P.', amount: '£4.00', status: 'completed', time: '1h ago' },
  ],

  commissions: [
    { id: 'TXN-8891', type: 'Sale Referral', buyer: 'Alex D.', amount: '£1.80', status: 'paid', date: '09 Jul 2026' },
    { id: 'TXN-8879', type: 'New Vendor Sign-up', buyer: 'Maria C.', amount: '£5.00', status: 'paid', date: '08 Jul 2026' },
    { id: 'TXN-8862', type: 'Sale Referral', buyer: 'Ben F.', amount: '£2.40', status: 'pending', date: '07 Jul 2026' },
    { id: 'TXN-8840', type: 'Bundle Sale Bonus', buyer: 'Priya K.', amount: '£3.20', status: 'pending', date: '05 Jul 2026' },
    { id: 'TXN-8811', type: 'Sale Referral', buyer: 'Omar L.', amount: '£1.50', status: 'paid', date: '02 Jul 2026' },
  ],
};
