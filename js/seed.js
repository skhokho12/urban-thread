// js/seed.js
// WARNING: Running this deletes ALL existing products, then reseeds 12 fresh ones.
// DELETE THIS FILE AFTER RUNNING ONCE.

import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

/**
 * Seed products into Firestore. This function first deletes all existing
 * documents in the `products` collection, then inserts 12 fresh products.
 */
export async function seedProducts() {
  const colRef = collection(db, 'products');

  // Fetch all existing documents in the collection.
  const existing = await getDocs(colRef);

  // Delete all existing documents in parallel to avoid duplicates from
  // previous runs. Use Promise.all to run deletions concurrently.
  await Promise.all(existing.docs.map(d => deleteDoc(d.ref)));

  // Define exactly 12 unique products (3 per category). Each product has
  // imageURL (unique Unsplash URL), numeric price, and optional flags.
  const products = [
    // Hoodies
    {
      name: 'Oversized Hoodie',
      category: 'Hoodies',
      price: 549.99,
      description: 'Soft cotton hoodie in oversized fit.',
      imageURL: 'https://images.unsplash.com/photo-1540961856014-1ecb8d1a2bde?w=600&q=80',
      isNew: true
    },
    {
      name: 'Zip-Up Fleece Hoodie',
      category: 'Hoodies',
      price: 599.99,
      description: 'Warm fleece zip-up with kangaroo pockets.',
      imageURL: 'https://images.unsplash.com/photo-1596461404969-3d8a8a6f5b3a?w=600&q=80'
    },
    {
      name: 'Heavyweight Hoodie',
      category: 'Hoodies',
      price: 649.99,
      description: 'Thick heavyweight hoodie for cooler days.',
      imageURL: 'https://images.unsplash.com/photo-1602810313974-0f38ac7e3f4b?w=600&q=80',
      onSale: true,
      originalPrice: 749.99
    },
    // T-shirts
    {
      name: 'Graphic Tee',
      category: 'T-shirts',
      price: 279.99,
      description: '100% cotton tee with bold front print.',
      imageURL: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'
    },
    {
      name: 'Plain Crewneck Tee',
      category: 'T-shirts',
      price: 199.99,
      description: 'Everyday crewneck in soft jersey cotton.',
      imageURL: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'
    },
    {
      name: 'Vintage Wash Tee',
      category: 'T-shirts',
      price: 329.99,
      description: 'Washed vintage look with soft handfeel.',
      imageURL: 'https://images.unsplash.com/photo-1503342217505-b0a15d3d3f3c?w=600&q=80',
      isNew: true
    },
    // Sneakers
    {
      name: 'Retro High-Top Sneakers',
      category: 'Sneakers',
      price: 899.99,
      description: 'Classic high-top silhouette with cushioned sole.',
      imageURL: 'https://images.unsplash.com/photo-1526178618290-58a4510f7f54?w=600&q=80'
    },
    {
      name: 'Canvas Low-Top Sneakers',
      category: 'Sneakers',
      price: 649.99,
      description: 'Lightweight canvas sneakers for daily wear.',
      imageURL: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=600&q=80'
    },
    {
      name: 'Court Sneakers',
      category: 'Sneakers',
      price: 1199.99,
      description: 'Performance court sneaker with modern cushioning.',
      imageURL: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      onSale: true,
      originalPrice: 1599.99
    },
    // Accessories
    {
      name: 'Snapback Cap',
      category: 'Accessories',
      price: 229.99,
      description: 'Adjustable snapback with embroidered logo.',
      imageURL: 'https://images.unsplash.com/photo-1519749942494-3e6f3c1d7b2e?w=600&q=80'
    },
    {
      name: 'Canvas Tote Bag',
      category: 'Accessories',
      price: 189.99,
      description: 'Reusable canvas tote with printed design.',
      imageURL: 'https://images.unsplash.com/photo-1520975900109-0b3d8e9b1d1f?w=600&q=80'
    },
    {
      name: 'Ribbed Beanie',
      category: 'Accessories',
      price: 169.99,
      description: 'Warm ribbed beanie for everyday wear.',
      imageURL: 'https://images.unsplash.com/photo-1503342452485-86b7b2330b3e?w=600&q=80',
      isNew: true
    }
  ];

  try {
    let count = 0;
    for (const p of products) {
      await addDoc(colRef, p);
      count++;
    }
    console.log(`✅ Seeded ${count} products`);
    return { success: true, message: `Seeded ${count} products.` };
  } catch (err) {
    return { success: false, message: 'Seeding failed: ' + err.message };
  }
}

// If this file is loaded directly from a page (seed.html), run seedProducts()
// immediately so the user can just open seed.html to perform seeding.
if (typeof window !== 'undefined') {
  // Run and log result; keep minimal UI feedback for seed.html.
  seedProducts().then(r => console.log(r)).catch(e => console.error(e));
}