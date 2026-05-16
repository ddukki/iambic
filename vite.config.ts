import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'editor-redirect',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/editor' || req.url === '/editor/') {
            req.url = '/editor/index.html'
          }
          next()
        })
      },
    },
  ],
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: {
        main: 'index.html',
        editor: 'editor/index.html',
      },
    },
  },
})
