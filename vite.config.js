import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative paths for GitHub Pages
  publicDir: 'public', // Explicitly set the public directory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Put font files in fonts directory
          if (/\.(woff2?|ttf|eot|otf)$/.test(assetInfo.name)) {
            return 'fonts/[name][extname]';
          }
          // Other assets go to assets directory with hash
          return 'assets/[name]-[hash][extname]';
        },
        // Move fonts to the fonts directory
        manualChunks: undefined
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Add path alias for easier imports
    }
  },
  // Copy fonts from public to dist during build
  assetsInclude: ['**/*.woff2'],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Referrer-Policy': 'no-referrer-when-downgrade',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
  }
});