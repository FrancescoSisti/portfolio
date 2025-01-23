import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular()
  ],
  build: {
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    preserveSymlinks: true
  },
  optimizeDeps: {
    include: [
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
