// js/firebase-config.js
// Placeholder Firebase configuration file.
// IMPORTANT: Replace the values in the firebaseConfig object below
// with your project's real configuration from the Firebase Console.
// Do NOT commit real API keys publicly.

// Import the Firebase modular SDK functions from CDN (v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration
// IMPORTANT: These values were provided by the user and are required
// for the Firebase SDK to connect to your project. Do NOT commit
// sensitive credentials to a public repository. Keep this file local.
const firebaseConfig = {
  apiKey: "AIzaSyAePZ3visusaHFN4dbeb_k6CZEc-261afo",
  authDomain: "urbanthreadsstore-9f47f.firebaseapp.com",
  projectId: "urbanthreadsstore-9f47f",
  storageBucket: "urbanthreadsstore-9f47f.firebasestorage.app",
  messagingSenderId: "771383194379",
  appId: "1:771383194379:web:0071d8de7645c76d36a80e"
};

// Initialize the Firebase app using the provided configuration.
// initializeApp creates and returns the Firebase App instance used by other services.
const app = initializeApp(firebaseConfig);

// Initialize and export Authentication and Firestore instances for use in other modules.
// getAuth connects to Firebase Authentication for the initialized app.
export const auth = getAuth(app);

// getFirestore connects to Cloud Firestore for the initialized app.
export const db = getFirestore(app);

// End of firebase-config.js
