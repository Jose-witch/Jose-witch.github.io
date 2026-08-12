/**
 * The one place that understands `![alt](src "caption")` in a post body.
 *
 * Everything that touches post text — the loader (which collects the gallery),
 * the reader (which lays the post out) and the card excerpt — goes through
 * here, so they can never disagree about what counts as an image. They used to
 * each carry their own regex, and the stricter one only recognised an image
 * that sat alone in its own paragraph: three photos on three consecutive lines
 * were printed to the page as raw `![](/photo.jpg)` text.
 *
 * The image path is read by counting brackets rather than by a plain regex, so
 * a filename that itself contains parentheses (`IMG_0421 (1).jpg`, what a phone
 * or a browser download tends to produce) is still read whole.
 */

export type MarkdownImage = {
  alt: string
  src: string
  caption?: string
}

export type BodyPiece = { kind: 'text'; text: string } | ({ kind: 'image' } & MarkdownImage)

/** Start of an image: `![alt](` — the path is scanned by hand from there. */
const IMAGE_START = /!\[(.*?)\]\(/g

/** Split `src "caption"` (the bit inside the parens); `src` may contain spaces. */
const SRC_CAPTION = /^\s*(.*?)\s*(?:"([^"]*)")?\s*$/

/** Read from just after `(` to its matching `)`, honouring nested parens. */
function readToClosingParen(text: string, from: number): { inner: string; end: number } | null {
  let depth = 1
  for (let i = from; i < text.length; i++) {
    const ch = text[i]
    if (ch === '(') depth++
    else if (ch === ')') {
      depth--
      if (depth === 0) return { inner: text.slice(from, i), end: i + 1 }
    }
  }
  return null // unclosed `(` — treat the whole thing as plain text
}

/** Break body text into its text runs and images, in order. */
export function splitImages(text: string): BodyPiece[] {
  const pieces: BodyPiece[] = []
  const pushText = (chunk: string) => {
    if (chunk.trim()) pieces.push({ kind: 'text', text: chunk.trim() })
  }

  let cursor = 0
  IMAGE_START.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = IMAGE_START.exec(text))) {
    const closed = readToClosingParen(text, IMAGE_START.lastIndex)
    if (!closed) continue

    const [, src = '', caption] = closed.inner.match(SRC_CAPTION) ?? []
    if (src) {
      pushText(text.slice(cursor, match.index))
      pieces.push({ kind: 'image', alt: match[1] || '', src, ...(caption ? { caption } : {}) })
      cursor = closed.end
    }
    IMAGE_START.lastIndex = closed.end
  }

  pushText(text.slice(cursor))
  return pieces
}

/** Every image in the text, in the order it appears. */
export function findImages(text: string): MarkdownImage[] {
  return splitImages(text).flatMap((p) => (p.kind === 'image' ? [{ alt: p.alt, src: p.src, ...(p.caption ? { caption: p.caption } : {}) }] : []))
}

/** The text with its images removed — for excerpts and previews. */
export function stripImages(text: string): string {
  return splitImages(text)
    .filter((p): p is { kind: 'text'; text: string } => p.kind === 'text')
    .map((p) => p.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
