import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        shop: 'shop.html',
        login: 'login.html',
        cart: 'cart.html',
        seed: 'seed.html',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
});
