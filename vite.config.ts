import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Hot reload for XML files during development
const xmlWatchPlugin = () => ({
  name: 'xml-watch',
  configureServer(server) {
    const xmlDir = path.resolve('src/data/xml');
    // Validate path to prevent directory traversal
    const normalizedPath = path.normalize(xmlDir);
    if (!normalizedPath.startsWith(path.resolve('src/data'))) {
      throw new Error('Invalid XML directory path');
    }
    
    if (fs.existsSync(normalizedPath)) {
      const watchPattern = path.join(normalizedPath, '**/*.xml');
      server.watcher.add(watchPattern);
      server.watcher.on('change', (file) => {
        // Validate file path to prevent path traversal
        const normalizedFile = path.normalize(file);
        if (normalizedFile.startsWith(normalizedPath) && normalizedFile.endsWith('.xml')) {
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
  },
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
    }
  }
})