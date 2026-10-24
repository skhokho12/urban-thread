// js/ui.js
// Shared UI helpers for navbar, cart badge, and mobile menu.

import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { auth } from './firebase-config.js';

const CART_KEY = 'urbanThreadsCart';

// Simple helper to compute cart count from localStorage
function getCartCount() {
  try {
    const raw = localStorage.getItem(CART_KEY) || '[]';
    const arr = JSON.parse(raw);
    return arr.reduce((s, i) => s + (i.qty || 0), 0);
  } catch (err) {
    return 0;
  }
}

function updateBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
  // Also update mobile menu badge if present
  const mobileAuth = document.getElementById('mobile-menu');
  if (mobileAuth) {
    const mobileCart = mobileAuth.querySelector('.mobile-cart-badge');
    if (mobileCart) mobileCart.textContent = count > 0 ? count : '';
  }
}

// Build avatar element showing first letter with tooltip title
function buildAvatar(email) {
  const span = document.createElement('div');
  span.className = 'avatar';
  span.title = email || '';
  span.textContent = email ? email[0].toUpperCase() : '?';
  return span;
}

// Mobile hamburger toggle
function initHamburger() {
  const btn = document.getElementById('nav-hamburger');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

// Render auth UI into #nav-auth according to state. We intentionally
// duplicate behavior here so we can present the avatar + outlined logout
// while leaving js/auth.js untouched.
function renderAuthUI(user) {
  const authRoot = document.getElementById('nav-auth');
  if (!authRoot) return;
  authRoot.innerHTML = '';
  if (user) {
    const avatar = buildAvatar(user.email || '');
    avatar.title = user.email || '';
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn ghost';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Sign-out error', err);
        alert('Error logging out: ' + (err && err.message));
      }
    });
    authRoot.appendChild(avatar);
    authRoot.appendChild(logoutBtn);
  } else {
    // logged out: show primary Login button and Sign Up text link
    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.className = 'btn';
    loginLink.textContent = 'Login';

    const signup = document.createElement('a');
    signup.href = 'login.html';
    signup.textContent = 'Sign Up';
    signup.style.marginLeft = '8px';
    signup.style.color = 'var(--text)';

    authRoot.appendChild(loginLink);
    authRoot.appendChild(signup);
  }
  // Also toggle any footer/mobile auth guest/user elements so a single
  // auth listener can control all auth-related UI across the page.
  document.querySelectorAll('.auth-guest').forEach(el => { el.style.display = user ? 'none' : ''; });
  document.querySelectorAll('.auth-user').forEach(el => { el.style.display = user ? '' : 'none' });
  // Update mobile auth action as well
  const mobileAuth = document.getElementById('mobile-auth-action');
  if (mobileAuth) {
    if (user) {
      mobileAuth.textContent = 'Logout';
      mobileAuth.classList.add('auth-user');
      mobileAuth.classList.remove('auth-guest');
      mobileAuth.onclick = async (e) => { e.preventDefault(); await signOut(auth); };
      // Ensure there's a separate mobile logout element if present
      const mobileLogout = document.getElementById('mobile-logout');
      if (mobileLogout) { mobileLogout.style.display = 'none'; }
    } else {
      mobileAuth.textContent = 'Login';
      mobileAuth.classList.add('auth-guest');
      mobileAuth.classList.remove('auth-user');
      mobileAuth.onclick = () => { window.location.href = 'login.html'; };
      const mobileLogout = document.getElementById('mobile-logout');
      if (mobileLogout) { mobileLogout.style.display = 'none'; }
    }
  }
}

// Listen for cart updates (dispatched by saveCart)
window.addEventListener('urbanThreads:cartUpdated', (e) => {
  updateBadge();
});

// Listen to Firebase auth state and render UI accordingly. This runs in
// addition to any logic inside js/auth.js; our listener overrides the
// visible navbar area to match the requested design.
onAuthStateChanged(auth, (user) => {
  renderAuthUI(user);
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  initHamburger();
  // ensure mobile auth action exists and is wired
  const mobileAuth = document.getElementById('mobile-auth-action');
  if (mobileAuth && !mobileAuth.onclick) mobileAuth.onclick = () => { window.location.href = 'login.html'; };
  // Close mobile menu when a link inside it is clicked
  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => document.body.classList.remove('nav-open'));
  });
});
