// js/auth.js
// Handles signup, login, logout, and navbar auth UI updates.

import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

/**
 * Initialize the navbar auth UI. This sets up an observer on auth state
 * and updates the `#nav-auth` element to show login link or user email + logout.
 */
export function initAuthUI() {
  const authRoot = document.getElementById('nav-auth');
  if (!authRoot) return;

  // Observe authentication state changes and update navbar accordingly.
  // onAuthStateChanged triggers whenever the user's sign-in state changes.
  onAuthStateChanged(auth, (user) => {
    authRoot.innerHTML = '';
    if (user) {
      // If the user is logged in, show their email and a logout button.
      const emailSpan = document.createElement('span');
      emailSpan.textContent = user.email;
      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = 'Logout';
      logoutBtn.className = 'btn ghost';
      logoutBtn.addEventListener('click', async () => {
        try {
          // signOut ends the user's session locally and on Firebase.
          await signOut(auth);
        } catch (err) {
          // Log errors to the console for debugging and show user-friendly message
          console.error('Sign-out error', err);
          alert('Error logging out: ' + (err && err.message));
        }
      });
      authRoot.appendChild(emailSpan);
      authRoot.appendChild(logoutBtn);
    } else {
      // Not logged in — show Login link.
      const loginLink = document.createElement('a');
      loginLink.href = 'login.html';
      loginLink.textContent = 'Login';
      authRoot.appendChild(loginLink);
    }
  });
}

/**
 * Initialize the login/signup form on `login.html`. This toggles between modes
 * and calls Firebase Authentication methods to create or sign in users.
 */
export function initAuthForm() {
  const form = document.getElementById('auth-form');
  if (!form) return;
  const toggleBtn = document.getElementById('toggle-btn');
  const title = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-btn');
  const errorEl = document.getElementById('auth-error');

  let isLogin = true; // start in login mode

  // Toggle between Login and Signup UI
  toggleBtn.addEventListener('click', () => {
    isLogin = !isLogin;
    title.textContent = isLogin ? 'Login' : 'Signup';
    submitBtn.textContent = isLogin ? 'Login' : 'Create Account';
    toggleBtn.textContent = isLogin ? 'Switch to Signup' : 'Switch to Login';
    errorEl.textContent = '';
  });

  // Handle form submit for login or signup
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    errorEl.textContent = '';
    try {
      if (isLogin) {
        // signInWithEmailAndPassword signs in an existing user with email/password
        await signInWithEmailAndPassword(auth, email, password);
        // After successful login, redirect to shop
        window.location.href = 'shop.html';
      } else {
        // createUserWithEmailAndPassword creates a new user account.
        await createUserWithEmailAndPassword(auth, email, password);
        // After signup, redirect to shop
        window.location.href = 'shop.html';
      }
    } catch (err) {
      // Log full error details for debugging (includes Firebase error code)
      console.error('Auth error', err);
      // Show a clearer message to the user including the Firebase error code
      errorEl.textContent = `${err.code || 'error'}: ${err.message}`;
    }
  });
}

// Exported for other modules to reuse if needed
export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
