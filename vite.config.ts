import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [
    angular(),
    splitVendorChunkPlugin()
  ],
  base: '/',
  server: {
    proxy: {},
    fs: {
      strict: true
    }
  },
  preview: {
    port: 4200,
    host: true
  },
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            '@angular/common',
            '@angular/core',
            '@angular/platform-browser',
            '@angular/router'
          ],
          'features': [
            './src/app/components/about/about.component',
            './src/app/components/projects/projects.component',
            './src/app/components/skills/skills.component',
            './src/app/components/contact/contact.component'
          ]
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  },
  resolve: {
    preserveSymlinks: true
  },
  optimizeDeps: {
    include: [
      '@angular/common',
      '@angular/core',
      '@angular/platform-browser',
      '@angular/router',
      'core-js/modules/es.promise.js',
      'core-js/modules/es.string.match.js',
      'core-js/modules/es.string.replace.js',
      'core-js/modules/es.string.starts-with.js',
      'core-js/modules/es.array.iterator.js',
      'core-js/modules/web.dom-collections.iterator.js',
      'core-js/modules/es.array.reduce.js',
      'core-js/modules/es.string.ends-with.js',
      'core-js/modules/es.string.split.js',
      'core-js/modules/es.string.trim.js',
      'core-js/modules/es.array.index-of.js',
      'core-js/modules/es.string.includes.js',
      'core-js/modules/es.array.reverse.js',
      'core-js/modules/es.regexp.to-string.js',
      'raf',
      'rgbcolor',
      'html2canvas',
      'dompurify'
    ]
  }
});
