# Urban Threads (Vanilla JS + Firebase)

Simple multi-page e-commerce demo using only HTML, CSS, vanilla JavaScript (ES modules), and Firebase (Authentication + Firestore). Designed to run with VS Code Live Server.

Setup
------
1. Open the project in VS Code and start Live Server to serve the files.
2. Open `js/firebase-config.js` and replace the placeholder values in `firebaseConfig` with your project's credentials from the Firebase Console.
3. In the Firebase Console, ensure Email/Password auth is enabled and Firestore rules allow reads/writes during development.

Seeding products (one-time)
---------------------------
1. Open `seed.html` in the browser via Live Server.
2. Click "Seed Products". This will write 8 sample products to your Firestore `products` collection.
3. DELETE or remove `seed.html` and `js/seed.js` after running once to avoid accidental duplicates.

Remaining Firebase Console Steps
--------------------------------
- Enable Email/Password sign-in provider (already done).
- Create Firestore database (already done).
- Add your app's Firebase config into `js/firebase-config.js` (replace placeholders).
- If you plan to restrict access later, update Firestore rules accordingly.

Running
-------
Start Live Server and visit:
- `index.html` — Landing page
- `shop.html` — Product listing (loads from Firestore)
- `login.html` — Signup/login
- `cart.html` — Cart (requires login)
- `seed.html` — One-time seeder (run once)
