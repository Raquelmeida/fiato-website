import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// We bundle everything (JS, CSS, fonts via @import, image assets) into a
// single dist/index.html so it can be opened directly from disk (file://)
// without a server — the constraint stated in the project documentation.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    // Inline assets up to ~10 MB so images get base64-embedded.
    assetsInlineLimit: 10 * 1024 * 1024,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});