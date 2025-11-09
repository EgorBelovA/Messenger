import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/', // Изменили на корень для dev сервера
  build: {
    outDir: '../backend/static', // Собираем статику прямо в Django static папку
    emptyOutDir: true,
    chunkSizeWarningLimit: 4000,
    assetsDir: '.', // Чтобы assets были в корне static
    rollupOptions: {
      output: {
        // Правильно именуем файлы для кэширования
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Проксируем API запросы к Django
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/accounts': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Для абсолютных импортов
    },
  },
});
