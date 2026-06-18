/**
 * Loads Playground posts from Markdown files in /content/playground/*.md so the
 * site owner can publish by writing Markdown + dropping images — no code.
 *
 * Everything is auto-inferred from the file so the only fields she must write
 * are `title` and `date`:
 *   - cover   → the FIRST `![](img)` in the body (omitted → a text card)
 *   - images  → ALL `![](img)` in the body, collected into the detail carousel
 *   - size    → `large` if the post has any image, else `small`
 *
 * Zero-dependency: a tiny frontmatter reader + the same `![alt](src "caption")`
 * image syntax the renderer already understands. No markdown engine needed.
 */
import type { PlayImage, PlayPost } from './content'

/** Eagerly pull every markdown file's raw text at build time (Vite). */
const files = import.meta.glob('/content/playground/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const IMG_RE = /!\[(.*?)\]\((\S*?)(?:\s+"(.*?)")?\)/g

/** Split `---\n...\n---\nbody` into a frontmatter map + the body text. */
function splitFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^\s*---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { meta: {}, body: raw.trim() }

  const meta: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!kv) continue
    meta[kv[1].trim().toLowerCase()] = kv[2].trim()
  }
  return { meta, body: m[2].trim() }
}

/** Parse a `tags: [a, b]` (or bare `a, b`) frontmatter value into a list. */
function parseTags(value?: string): string[] {
  if (!value) return []
  return value
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

/** Collect every `![alt](src "caption")` image in body order. */
function extractImages(body: string): PlayImage[] {
  const images: PlayImage[] = []
  for (const m of body.matchAll(IMG_RE)) {
    const [, alt, src, caption] = m
    if (!src) continue
    images.push({ src, alt: alt || '', ...(caption ? { caption } : {}) })
  }
  return images
}

/** Filename → fallback id/slug, e.g. ".../2025-02-11-u-bahn-ghosts.md" → that stem. */
function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

/** Strip an inline image's caption from an excerpt source (keep the prose). */
function firstParagraph(body: string): string {
  const block = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^!\[/.test(b))
  return (block ?? '').replace(/\s+/g, ' ').trim()
}

function toPost(path: string, raw: string): PlayPost {
  const { meta, body } = splitFrontmatter(raw)
  const slug = slugFromPath(path)
  const images = extractImages(body)
  const hasImage = images.length > 0

  return {
    id: meta.id || slug,
    title: meta.title || slug,
    // date drives sort + display; fall back to a leading YYYY-MM-DD in the name.
    date: meta.date || slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '',
    excerpt: meta.excerpt || firstParagraph(body),
    body,
    // Auto: first body image is the cover; all body images are the carousel.
    ...(hasImage ? { cover: images[0], images } : {}),
    size: hasImage ? 'large' : 'small',
    tags: parseTags(meta.tags),
  }
}

/** All posts, newest first. */
export const playgroundPosts: PlayPost[] = Object.entries(files)
  .map(([path, raw]) => toPost(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date))
