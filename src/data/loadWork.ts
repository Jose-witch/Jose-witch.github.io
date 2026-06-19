/**
 * Loads the Work section from a single Markdown file at /content/work.md so the
 * site owner can edit the intro + project lists by writing plain text — no code.
 *
 * The file has TWO parts:
 *   1. Frontmatter (`title` + the intro paragraphs) between the top `---` lines.
 *   2. A body of `## Group` headings, each followed by a list of projects.
 *
 * A project is one bullet line. Everything after the title is optional:
 *   - `Project title`                       → just a title
 *   - `Project title | note`                → title + right-aligned note (year/venue)
 *   - `Project title | note | https://url`  → title + note + a paper/link URL (↗)
 *   - `Project title |  | https://url`       → title + URL, no note
 *
 * Zero-dependency: a tiny frontmatter reader + a `|`-splitter. No markdown engine.
 */
import type { ProjectEntry, WorkGroup, WorkContent } from './content'

/** Eagerly pull the single work markdown file's raw text at build time (Vite). */
const files = import.meta.glob('/content/work.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Split `---\n...\n---\nbody` into a frontmatter map + the body text. */
function splitFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^\s*---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { meta: {}, body: raw.trim() }

  const meta: Record<string, string> = {}
  let key = ''
  for (const line of m[1].split('\n')) {
    // Support multi-line / continued values for the intro block (`intro:` + `-` items).
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    const item = line.match(/^\s*-\s+(.*)$/)
    if (kv) {
      key = kv[1].trim().toLowerCase()
      meta[key] = kv[2].trim()
    } else if (item && key) {
      // Append list items (used by `intro:`) onto the running key with a separator.
      meta[key] = (meta[key] ? meta[key] + '\n' : '') + item[1].trim()
    }
  }
  return { meta, body: m[2].trim() }
}

/** Build a unique, url-safe id from a title. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Parse one project bullet `Title | note | url` into a ProjectEntry. */
function parseEntry(line: string): ProjectEntry {
  const [title = '', note = '', url = ''] = line.split('|').map((s) => s.trim())
  return {
    id: slugify(title) || `entry-${Math.random().toString(36).slice(2, 8)}`,
    title,
    body: '',
    note,
    ...(url ? { url } : {}),
  }
}

/** Parse the body into `## Group` sections, each holding its bullet projects. */
function parseGroups(body: string): WorkGroup[] {
  const groups: WorkGroup[] = []
  let current: WorkGroup | null = null

  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line) continue

    const heading = line.match(/^#{1,6}\s+(.*)$/)
    if (heading) {
      const label = heading[1].trim()
      current = { id: slugify(label) || label, label, entries: [] }
      groups.push(current)
      continue
    }

    const bullet = line.match(/^[-*]\s+(.*)$/)
    if (bullet && current) {
      current.entries.push(parseEntry(bullet[1]))
    }
  }

  return groups
}

/** Split the `intro:` frontmatter (newline-joined list items) into paragraphs. */
function parseIntro(value?: string): string[] {
  if (!value) return []
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function toWork(raw: string): WorkContent {
  const { meta, body } = splitFrontmatter(raw)
  return {
    title: meta.title || 'Work',
    intro: parseIntro(meta.intro),
    groups: parseGroups(body),
  }
}

const raw = Object.values(files)[0] ?? ''

export const work: WorkContent = toWork(raw)
