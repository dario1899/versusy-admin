import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const dir = join(fileURLToPath(import.meta.url), '..', '..', 'dist')
const src = join(dir, 'index.html')
const dest = join(dir, '404.html')
if (existsSync(src)) {
  copyFileSync(src, dest)
  console.log('Copied index.html → 404.html for GitHub Pages SPA routing')
}
