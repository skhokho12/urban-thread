// js/cart.js
// Renders the cart page from localStorage and enforces auth redirect

import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { formatZAR } from './format.js';

const CART_KEY = 'urbanThreadsCart';

let cart = [];

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (err) {
    console.warn('Failed to parse cart from localStorage, resetting to []', err);
    return [];
  }
}

function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent('urbanThreads:cartUpdated', { detail: { count: c.reduce((s, i) => s + i.qty, 0) } }));
}

/**
 * Initialize cart page. Redirects to login if no user is signed in.
 */
export function initCart() {
  const root = document.getElementById('cart-root');
  if (!root) return;

  // Use onAuthStateChanged to ensure only authenticated users can view the cart
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // If not logged in, redirect to login page.
      window.location.href = 'login.html';
      return;
    }
    // Load cart now that we're ready to render and have auth state.
    cart = loadCart();
    renderCart(root);
  });
}

/**
 * Render the cart items from localStorage into the provided container.
 * @param {HTMLElement} container
 */
export function renderCart(container) {
  // Use the in-memory `cart` that was loaded from localStorage at module top.
  container.innerHTML = '';

  if (cart.length === 0) {
    // Show friendly message and link to shop when cart is empty.
    container.innerHTML = `<p>Your cart is empty. Time to fix that → <a href="shop.html">Shop</a></p>`;
    const summary = document.createElement('div');
    summary.style.marginTop = '12px';
    summary.innerHTML = `<h3>Total: ${formatZAR(0)}</h3>`;
    container.appendChild(summary);
    return;
  }

  const list = document.createElement('div');
  list.className = 'cart-list';

  let total = 0;

  for (const item of cart) {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.imageURL}" alt="${item.name}" />
      <div style="flex:1">
        <div><strong>${item.name}</strong></div>
        <div>${formatZAR(item.price)} x <span class="qty-label">${item.qty}</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
        <div style="display:flex;gap:6px;align-items:center;">
          <button class="btn ghost dec" data-id="${item.id}">−</button>
          <div class="qty-display">${item.qty}</div>
          <button class="btn inc" data-id="${item.id}">+</button>
        </div>
        <button class="btn ghost remove" data-id="${item.id}">Remove</button>
      </div>
    `;
    list.appendChild(el);
    total += item.price * item.qty;
  }

  const summary = document.createElement('div');
  summary.style.marginTop = '12px';
  summary.innerHTML = `<h3>Total: ${formatZAR(total)}</h3>`;

  // Clear cart button with confirmation
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn ghost';
  clearBtn.textContent = 'Clear Cart';
  clearBtn.addEventListener('click', () => {
    if (confirm('Clear the entire cart?')) {
        // Remove cart from localStorage and clear in-memory cart
        localStorage.removeItem(CART_KEY);
        cart.length = 0; // mutate array to empty
        saveCart(cart);
        renderCart(container);
    }
  });

  container.appendChild(list);
  container.appendChild(summary);
  container.appendChild(clearBtn);

  // Handle quantity increment/decrement and remove buttons.
  // Use assignment (`onclick`) instead of `addEventListener` to avoid
  // accumulating duplicate listeners when `renderCart` runs multiple times.
  container.onclick = (e) => {
    const dec = e.target.closest('.dec');
    const inc = e.target.closest('.inc');
    const rem = e.target.closest('.remove');
    if (dec) {
      const id = dec.dataset.id;
      changeQty(id, -1);
      renderCart(container);
      return;
    }
    if (inc) {
      const id = inc.dataset.id;
      changeQty(id, +1);
      renderCart(container);
      return;
    }
    if (rem) {
      const id = rem.dataset.id;
      removeItem(id);
      renderCart(container);
      return;
    }
  };
}

/**
 * Change quantity for a cart item by delta and persist to localStorage.
 * @param {string} id
 * @param {number} delta
 */
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    // If qty reaches 0, remove the item from cart.
    removeItem(id);
  } else {
    // Persist the updated cart to localStorage after qty change
    saveCart(cart);
  }
}

/**
 * Remove an item from the cart and persist change.
 * @param {string} id
 */
function removeItem(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;
  cart.splice(idx, 1);
  // Update localStorage after removing the item so changes persist.
  saveCart(cart);
}
