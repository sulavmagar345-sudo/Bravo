import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function serveAssetsFolder(): Plugin {
  return {
    name: 'serve-assets-folder',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/assets/')) {
          // Remove query params if any
          const cleanUrl = req.url.split('?')[0]
          const filePath = path.join(__dirname, decodeURIComponent(cleanUrl))
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            const mimeTypes: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.gif': 'image/gif',
              '.webp': 'image/webp',
              '.svg': 'image/svg+xml',
              '.mp4': 'video/mp4',
            }
            res.writeHead(200, {
              'Content-Type': mimeTypes[ext] || 'application/octet-stream',
              'Cache-Control': 'no-cache',
            })
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }
        next()
      })
    },
    closeBundle() {
      const srcDir = path.join(__dirname, 'assets')
      const destDir = path.join(__dirname, 'dist', 'assets')
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        const files = fs.readdirSync(srcDir)
        for (const file of files) {
          const srcFile = path.join(srcDir, file)
          const destFile = path.join(destDir, file)
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile)
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), serveAssetsFolder()],
})
