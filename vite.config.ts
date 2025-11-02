import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Hot reload for XML files during development
const xmlWatchPlugin = () => ({
  name: 'xml-watch',
  configureServer(server) {
    const xmlDir = path.resolve('src/data/xml');
    if (fs.existsSync(xmlDir)) {
      server.watcher.add(path.join(xmlDir, '**/*.xml'));
      server.watcher.on('change', (file) => {
        if (file.endsWith('.xml')) {
          console.log('XML file changed, triggering reload...');
          server.ws.send({
            type: 'full-reload'
          });
        }
      });
    }
  }
});

export default defineConfig({
  plugins: [react(), xmlWatchPlugin()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'bible-data': ['./src/data/processed/index']
        }
      }
    }
  },
  assetsInclude: ['**/*.xml', '**/*.json'],
  optimizeDeps: {
    include: ['xmldom']
  }
})