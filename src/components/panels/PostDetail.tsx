import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { color, font, type, ease } from '../../styles/theme'
import { ImageSlot } from '../ImageSlot'
import type { PlayPost } from '../../data/content'
import { fmtDate } from './PlaygroundPanel'

type Props = {
  post: PlayPost
  onClose: () => void
}

/**
 * The opened post — a takeover over the masonry. Three modes:
 *   - multi-image  → carousel (arrows + dots) on the left, meta/text on right
 *   - single image → the image fixed (no carousel chrome)
 *   - pure text    → a centred, narrow reading column (blog mode)
 * Backdrop click / ✕ / Escape returns to the wall.
 */
export function PostDetail({ post, onClose }: Props) {
  const frames = post.images ?? []
  const [frame, setFrame] = useState(0)
  const many = frames.length > 1
  const hasImages = frames.length > 0

  useEffect(() => setFrame(0), [post.id])

  useEffect(() => {
    document.body.classList.add('post-open')
    return () => document.body.classList.remove('post-open')
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'ArrowRight' && many) {
        setFrame((f) => Math.min(f + 1, frames.length - 1))
      } else if (e.key === 'ArrowLeft' && many) {
        setFrame((f) => Math.max(f - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [many, frames.length, onClose])

  const cur = frames[frame]
  const minRead = Math.max(1, Math.round(post.body.split(/\s+/).length / 200))

  const closeBtn = (
    <button
      type="button"
      onClick={onClose}
      className="post-close"
      aria-label="Back to wall"
      style={{
        position: 'fixed',
        top: 'clamp(20px,3vw,32px)',
        right: 'clamp(22px,3vw,40px)',
        zIndex: 60,
        width: 'clamp(40px,4vw,52px)',
        height: 'clamp(40px,4vw,52px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: font.mono,
        fontSize: 'clamp(30px,3vw,40px)',
        lineHeight: 1,
        color: color.inkMuted,
        cursor: 'pointer',
      }}
    >
      <span className="x-glyph">✕</span>
    </button>
  )

  // ── meta + title + body, shared by all modes ───────────────────────────────
  const meta = (
    <div className="post-meta-line">
      {fmtDate(post.date)}
      {hasImages
        ? ` · ${frames.length} ${frames.length === 1 ? 'frame' : 'frames'}`
        : ` · ${minRead} min read`}
    </div>
  )

  const title = (
    <h2
      style={{
        fontFamily: font.display,
        fontWeight: 600,
        fontSize: type.displaySm,
        lineHeight: 1.02,
        letterSpacing: '-.02em',
        color: color.ink,
        margin: 0,
      }}
    >
      {post.title}
    </h2>
  )

  const body = <PostBody body={post.body} renderImages={!hasImages} />

  return createPortal(
    <div
      onClick={onClose}
      className="post-detail"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 44,
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#070706',
        backgroundImage:
          'linear-gradient(180deg, rgba(5,5,5,.78) 0%, rgba(7,7,6,.92) 100%), radial-gradient(76% 84% at 50% 42%, rgba(232,226,212,.04) 0%, transparent 58%), url("/intro.jpeg")',
        backgroundSize: '100% 100%, 100% 100%, cover',
        backgroundPosition: 'center, center, center bottom',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        animation: `postIn .5s ${ease.spring} both`,
      }}
    >
      {closeBtn}

      {hasImages ? (
        // ── image / mixed post: image column + text column ──────────────────
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={post.title}
          className="post-grid"
          style={{
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            maxWidth: 1080,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, .9fr)',
            alignItems: 'center',
            gap: 'clamp(26px,4vw,64px)',
            padding: 'clamp(50px,6vh,80px) clamp(26px,7vw,90px)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              className="img-slot"
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                background: 'rgba(232,226,212,.035)',
                border: `0.5px solid ${color.lineSoft}`,
              }}
            >
              <ImageSlot src={cur.src} placeholder="drop image" alt={cur.alt} />
            </div>

            {cur.caption && (
              <div
                style={{
                  fontFamily: font.mono,
                  fontSize: type.mono,
                  color: color.inkFaint,
                  marginTop: 9,
                }}
              >
                {cur.caption}
              </div>
            )}

            {many && (
              <>
                <button
                  type="button"
                  className="post-arrow"
                  aria-label="Previous"
                  disabled={frame === 0}
                  onClick={() => setFrame((f) => Math.max(f - 1, 0))}
                  style={{ left: 10 }}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="post-arrow"
                  aria-label="Next"
                  disabled={frame === frames.length - 1}
                  onClick={() => setFrame((f) => Math.min(f + 1, frames.length - 1))}
                  style={{ right: 10 }}
                >
                  ›
                </button>

                <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 16 }}>
                  {frames.map((f, i) => (
                    <button
                      key={f.src + i}
                      type="button"
                      aria-label={`Frame ${i + 1}`}
                      onClick={() => setFrame(i)}
                      style={{
                        width: i === frame ? 22 : 7,
                        height: 1,
                        padding: 0,
                        border: 'none',
                        borderRadius: 0,
                        cursor: 'pointer',
                        background: i === frame ? color.inkMuted : color.inkGhost,
                        transition: `width .4s ${ease.spring}, background .3s ease`,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div>
            {meta}
            {title}
            {body}
          </div>
        </div>
      ) : (
        // ── pure-text post: a narrow, centred reading column ────────────────
        <article
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={post.title}
          className="post-read"
          style={{
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            maxWidth: 620,
            margin: '0 auto',
            padding: 'clamp(72px,12vh,120px) clamp(26px,7vw,40px) clamp(60px,10vw,100px)',
          }}
        >
          {meta}
          {title}
          {body}
        </article>
      )}
    </div>,
    document.body,
  )
}

/**
 * Renders the post body: blank-line-separated paragraphs, with inline
 * `![alt](src "caption")` images rendered full-width with an optional mono
 * caption (§5.4). Kept deliberately small — no full markdown engine needed.
 */
function PostBody({ body, renderImages = true }: { body: string; renderImages?: boolean }) {
  const blocks = body.split(/\n\s*\n/)
  const imgRe = /^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/

  return (
    <div className="post-body" style={{ margin: '20px 0 0' }}>
      {blocks.map((raw, i) => {
        const block = raw.trim()
        if (!block) return null
        const m = block.match(imgRe)
        if (m) {
          if (!renderImages) return null
          const [, alt, src, caption] = m
          return (
            <figure key={i} style={{ margin: '24px 0' }}>
              <div
                className="img-slot"
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  background: 'rgba(232,226,212,.035)',
                  border: `0.5px solid ${color.lineSoft}`,
                }}
              >
                <ImageSlot src={src} placeholder="drop image" alt={alt} />
              </div>
              {caption && (
                <figcaption
                  style={{
                    fontFamily: font.mono,
                    fontSize: type.mono,
                    color: color.inkFaint,
                    marginTop: 8,
                  }}
                >
                  {caption}
                </figcaption>
              )}
            </figure>
          )
        }
        return (
          <p
            key={i}
            style={{
              fontFamily: font.serif,
              fontSize: type.body,
              lineHeight: 1.7,
              color: color.inkMuted,
              margin: '0 0 16px',
            }}
          >
            {block}
          </p>
        )
      })}
    </div>
  )
}
