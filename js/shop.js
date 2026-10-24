// js/shop.js
// Fetches products from Firestore and renders them with client-side filters

import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { formatZAR } from './format.js';

// LocalStorage key for cart persistence
const CART_KEY = 'urbanThreadsCart';

// In-memory cart is loaded during initShop via loadCart(). Avoid top-level
// reads so the cart is deterministic and can be controlled during init.
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
  // Try to keep any UI badges in sync by dispatching a simple event
  // that other modules (like navbar) can listen to if needed.
  window.dispatchEvent(new CustomEvent('urbanThreads:cartUpdated', { detail: { count: c.reduce((s, i) => s + i.qty, 0) } }));
}

/**
 * Initialize the shop page: load products and wire filters.
 */
export async function initShop() {
  const grid = document.getElementById('grid');
  const filters = document.getElementById('filters');
  if (!grid) return;

  let products = [];

  // Load cart at initialization time
  cart = loadCart();

  try {
    // collection(db, 'products') creates a reference to the products collection.
    // getDocs fetches all documents in the collection as a snapshot.
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    // Map Firestore documents into plain JS objects with id
    products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    // Show user-friendly error if fetching products fails
    grid.innerHTML = `<p style="color:crimson;">Error loading products: ${err.message}</p>`;
    return;
  }

  // Render products into the grid
  function render(list) {
    grid.innerHTML = '';
    for (const p of list) {
      const cardWrap = document.createElement('div');
      cardWrap.className = 'card-wrap';
      const card = document.createElement('div');
      card.className = 'card';

      // Build badge markup if product has isNew or onSale
      let badgeHtml = '';
      if (p.isNew) badgeHtml += `<span class="badge new">New</span>`;
      if (p.onSale) badgeHtml += `<span class="badge sale">Sale</span>`;

      card.innerHTML = `
        <div class="badges">${badgeHtml}</div>
        <img src="${p.image || p.imageURL || ''}" alt="${p.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/600x600?text=No+Image'" />
        <div class="card-body">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="card-actions">
            <div>
              ${p.onSale && p.originalPrice ? `<span class="price-original">${formatZAR(p.originalPrice)}</span>` : ''}
              <span class="price">${formatZAR(p.price)}</span>
            </div>
            <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      `;
      cardWrap.appendChild(card);
      grid.appendChild(cardWrap);
    }
  }

  // Add click handlers for Add to Cart buttons (delegation)
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const id = btn.dataset.id;
    const product = products.find(x => x.id === id);
    if (!product) return;
    addToCart(product);
  });

  // Wire up search input to filter products by name (client-side)
  const searchInput = document.getElementById('search');
  searchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    render(products.filter(p => p.name.toLowerCase().includes(q)));
  });

  // Filter buttons logic
  filters?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    // Update active state styles
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    if (cat === 'All') render(products);
    else render(products.filter(p => p.category === cat));
  });

  // Initial render of all products
  render(products);
}

/**
 * Add a product to the localStorage-based cart.
 * If the product exists in cart, increment quantity.
 * @param {object} product - product object to add
 */
  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageURL: product.image || product.imageURL || '',
        category: product.category || '',
        qty: 1
      });
    }

    // Persist and notify other parts of the app
    saveCart(cart);

    alert('Added to cart');
  }
