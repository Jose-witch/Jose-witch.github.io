import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { color, font, type, ease } from '../../styles/theme'
import { ImageSlot } from '../ImageSlot'
import type { PlayPost } from '../../data/content'

type Props = {
  post: PlayPost
  onClose: () => void
}

/**
 * The opened "post" — an Instagram-style takeover that slides over the photo
 * wall. A frame-by-frame carousel on the left (paged with the dots / arrows),
 * the title, date and body alongside. Click the backdrop, the back arrow, or
 * press Escape to return to the wall.
 */
export function PostDetail({ post, onClose }: Props) {
  const [frame, setFrame] = useState(0)
  const frames = post.frames
  const many = frames.length > 1

  // Reset to the first frame whenever a different post is opened.
  useEffect(() => setFrame(0), [post.id])

  // While a post is open, flag the body so the underlying section panel hides
  // its own ✕ (which would return all the way home). Our ✕ replaces it and
  // steps back only to the wall — see .post-open .panel-close in global.css.
  useEffect(() => {
    document.body.classList.add('post-open')
    return () => document.body.classList.remove('post-open')
  }, [])

  // Escape closes the post (not the whole panel — App's Escape would jump all
  // the way home, so we stop it here while a post is open).
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
        scrollSnapType: 'y proximity',
        scrollBehavior: 'smooth',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(180deg, rgba(7,5,3,.55) 0%, rgba(7,5,3,.74) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: `postIn .5s ${ease.spring} both`,
      }}
    >
      {/* The post sits ON TOP of the section panel, whose own ✕ (z-43, returns
          all the way home) is directly below this one. We render our own ✕ at a
          higher z so a habitual "close" click lands here and steps back just one
          level — to the wall — instead of punching through to home. */}
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
          fontSize: 'clamp(34px,3.4vw,44px)',
          lineHeight: 1,
          color: 'rgba(241,233,216,.72)',
          cursor: 'pointer',
        }}
      >
        <span className="x-glyph">✕</span>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={post.title}
        className="post-grid"
        style={{
          position: 'relative',
          scrollSnapAlign: 'center',
          flexShrink: 0,
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, .85fr)',
          alignItems: 'center',
          gap: 'clamp(26px,4vw,64px)',
          padding:
            'clamp(50px,6vh,80px) clamp(26px,7vw,90px)',
        }}
      >
        {/* ===== carousel ===== */}
        <div style={{ position: 'relative' }}>
          <div
            className="img-slot"
            style={{
              position: 'relative',
              aspectRatio: cur.aspect,
              background: cur.image ? color.bgSlot : 'rgba(236,228,206,.06)',
              border: cur.image
                ? `1px solid rgba(236,228,206,.26)`
                : `1px dashed rgba(236,228,206,.28)`,
            }}
          >
            <ImageSlot src={cur.image} placeholder={cur.placeholder} alt={post.title} />
          </div>

          {cur.note && (
            <div
              style={{
                fontFamily: font.serif,
                fontStyle: 'italic',
                fontSize: type.caption,
                color: color.inkFaint,
                marginTop: 9,
              }}
            >
              {cur.note}
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

              {/* frame dots */}
              <div
                style={{
                  display: 'flex',
                  gap: 7,
                  justifyContent: 'center',
                  marginTop: 16,
                }}
              >
                {frames.map((f, i) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-label={`Frame ${i + 1}`}
                    onClick={() => setFrame(i)}
                    style={{
                      width: i === frame ? 22 : 7,
                      height: 7,
                      padding: 0,
                      border: 'none',
                      borderRadius: 999,
                      cursor: 'pointer',
                      background: i === frame ? color.redBright : color.inkGhost,
                      transition: `width .4s ${ease.spring}, background .3s ease`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ===== post text ===== */}
        <div>
          <div
            style={{
              fontFamily: font.code,
              fontSize: type.micro,
              letterSpacing: '.04em',
              textTransform: 'uppercase',
              color: color.redBright,
              marginBottom: 14,
            }}
          >
            {post.date} · {frames.length} {frames.length === 1 ? 'frame' : 'frames'}
          </div>
          <h2
            style={{
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: type.displaySm,
              lineHeight: 1,
              color: color.ink,
              margin: 0,
            }}
          >
            {post.title}
          </h2>
          <p
            style={{
              fontFamily: font.mono,
              fontSize: type.body,
              lineHeight: 1.7,
              color: color.inkSoft,
              margin: '22px 0 0',
              maxWidth: 460,
            }}
          >
            {post.body}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
