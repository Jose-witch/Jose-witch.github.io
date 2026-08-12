/**
 * Turns whatever image path is written in a Markdown post into a URL that
 * actually resolves — so a post publishes even when the filename in the text
 * and the uploaded photo don't line up perfectly.
 *
 * The index (filename → URL) is built at build time by the `site-media` Vite
 * plugin and covers `public/`, `content/**` and the repo root, so it does not
 * matter which of those folders the photo was dropped into.
 *
 * Matching goes from strict to forgiving:
 *   1. exact filename            `/barcelona_beach.jpg`
 *   2. ignoring case             `Barcelona_Beach.JPG`
 *   3. ignoring case, spaces,    `barcelona beach.jpeg` → `barcelona_beach.jpg`
 *      punctuation & extension
 *   4. a close typo (≤2 letters) `barcelona_beach.jpg` → `barcelone_beach.jpg`
 *      — only when exactly one photo is that close, never a coin flip.
 */
import mediaIndex from 'virtual:media-index'

/** The bare filename of a path or URL: `./img/a%20b.jpg?x` → `a b.jpg`. */
export function fileName(src: string): string {
  const path = src.trim().split(/[?#]/)[0]
  let decoded = path
  try {
    decoded = decodeURIComponent(path)
  } catch {
    // A stray `%` in the name — fall back to the raw text.
  }
  return decoded.split('/').pop() ?? ''
}

/** Strip case, punctuation and the extension so near-misses can be compared. */
function loosen(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9]/g, '')
}

const byName = new Map<string, string>()
const byLoose = new Map<string, string | null>() // null = ambiguous, don't guess

for (const [name, url] of Object.entries(mediaIndex)) {
  byName.set(name.toLowerCase(), url)
  const loose = loosen(name)
  byLoose.set(loose, byLoose.has(loose) ? null : url)
}

const looseNames = [...byLoose.keys()]

/** Levenshtein distance, capped: we only care about "is this within `max`". */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    let best = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost)
      best = Math.min(best, row[j])
    }
    if (best > max) return max + 1
    prev = row
  }
  return prev[b.length]
}

/** The single closest filename within `max` edits, or null if it's a tie. */
function closest(loose: string, max: number): string | null {
  let winner: string | null = null
  let winnerDistance = max + 1
  for (const candidate of looseNames) {
    const d = distance(loose, candidate, max)
    if (d < winnerDistance) {
      winnerDistance = d
      winner = candidate
    } else if (d === winnerDistance) {
      winner = null // tie → too risky to pick one
    }
  }
  return winnerDistance <= max ? winner : null
}

/** Resolve a Markdown image path to a real site URL (unchanged if unknown). */
export function resolveMedia(src: string): string {
  const raw = src.trim()
  if (!raw || /^(https?:)?\/\//i.test(raw) || raw.startsWith('data:')) return raw

  // Only the filename matters — `/photo.jpg`, `photo.jpg`, `./img/photo.jpg`
  // and a github.com upload path all point at the same uploaded photo.
  const file = fileName(raw)
  if (!file) return raw

  const hit = byName.get(file.toLowerCase())
  if (hit) return encodeURI(hit)

  const loose = loosen(file)
  if (!loose) return raw

  const looseHit = byLoose.get(loose)
  if (looseHit) return encodeURI(looseHit)

  // Last resort: forgive a small typo, but only on a name long enough that a
  // 2-letter difference still means "the same word".
  if (looseHit === undefined && loose.length >= 6) {
    const near = closest(loose, 2)
    const url = near ? byLoose.get(near) : null
    if (url) return encodeURI(url)
  }

  return raw
}
