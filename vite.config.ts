import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Media the site owner may upload by drag-and-drop on github.com.
 * She should not have to know where a file "belongs", so we accept uploads in
 * `public/`, anywhere under `content/` (i.e. right next to the post that uses
 * them) and at the repo root, then expose one filename → URL index to the app.
 */
const MEDIA_RE = /\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov)$/i

const VIRTUAL_ID = 'virtual:media-index'
const RESOLVED_ID = '\0' + VIRTUAL_ID

/** Files under `content/` and the repo root are served/copied under this prefix. */
const MEDIA_PREFIX = '/media/'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

function walkMedia(dir: string, recursive: boolean, out: string[] = []): string[] {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (recursive) walkMedia(abs, true, out)
    } else if (MEDIA_RE.test(entry.name)) {
      out.push(abs)
    }
  }
  return out
}

type MediaScan = {
  /** filename → public URL, e.g. `berlin.jpg` → `/berlin.jpg` */
  index: Record<string, string>
  /** uploads outside `public/` that we serve (dev) and copy (build) ourselves */
  extra: { name: string; abs: string }[]
}

function scanMedia(root: string): MediaScan {
  const publicDir = path.join(root, 'public')
  const index: Record<string, string> = {}
  const extra: MediaScan['extra'] = []

  // 1. public/ — Vite already serves and copies these verbatim.
  for (const abs of walkMedia(publicDir, true)) {
    const rel = path.relative(publicDir, abs).split(path.sep).join('/')
    const name = path.basename(abs)
    if (!index[name]) index[name] = '/' + rel
  }

  // 2. content/ (next to the posts) and 3. the repo root (a mis-aimed upload).
  for (const abs of [...walkMedia(path.join(root, 'content'), true), ...walkMedia(root, false)]) {
    const name = path.basename(abs)
    if (index[name]) continue
    index[name] = MEDIA_PREFIX + name
    extra.push({ name, abs })
  }

  return { index, extra }
}

/** Exposes the media index to the app and makes non-`public/` uploads work. */
function siteMedia(): Plugin {
  let root = process.cwd()
  let scan: MediaScan = { index: {}, extra: [] }
  const refresh = () => {
    scan = scanMedia(root)
  }

  return {
    name: 'site-media',
    configResolved(config) {
      root = config.root
      refresh()
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null
    },
    load(id) {
      if (id !== RESOLVED_ID) return null
      // Re-scan on load so a newly uploaded photo is picked up without a restart.
      refresh()
      return `export default ${JSON.stringify(scan.index)}`
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split(/[?#]/)[0]
        if (!url || !url.startsWith(MEDIA_PREFIX)) return next()
        const name = decodeURIComponent(url.slice(MEDIA_PREFIX.length))
        const hit = scan.extra.find((f) => f.name === name)
        if (!hit) return next()
        res.setHeader('Content-Type', MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream')
        fs.createReadStream(hit.abs).pipe(res)
      })

      // A dropped-in / renamed photo should show up without restarting the server.
      const onChange = (file: string) => {
        if (!MEDIA_RE.test(file)) return
        refresh()
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange).on('unlink', onChange)
    },
    writeBundle(options) {
      // Copy the non-`public/` uploads into the built site under /media/.
      const outDir = options.dir ?? path.join(root, 'dist')
      for (const { name, abs } of scan.extra) {
        const dest = path.join(outDir, MEDIA_PREFIX.slice(1), name)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.copyFileSync(abs, dest)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteMedia()],
})
