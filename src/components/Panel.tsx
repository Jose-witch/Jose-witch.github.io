import type { ReactNode } from 'react'
import { color, font } from '../styles/theme'

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * A full-screen darkroom takeover (not a small modal). When a section is
 * opened, the home page fades out and this layer lifts into place. Backdrop
 * click / ✕ / Escape all close it.
 */
export function Panel({ open, onClose, children }: Props) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        // scroll happens on this full-width layer, so the scrollbar hugs the
        // viewport's right edge instead of the centered content's edge.
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: open ? '#070706' : 'rgba(17,17,16,0)',
        backgroundImage: open
          ? 'linear-gradient(180deg, rgba(5,5,5,.78) 0%, rgba(7,7,6,.9) 100%), radial-gradient(85% 92% at 52% 40%, rgba(232,226,212,.045) 0%, transparent 58%), url("/intro.jpeg")'
          : 'none',
        backgroundSize: '100% 100%, 100% 100%, cover',
        backgroundPosition: 'center, center, center bottom',
        backgroundRepeat: 'no-repeat',
        backdropFilter: open ? 'blur(3px)' : 'blur(0)',
        WebkitBackdropFilter: open ? 'blur(3px)' : 'blur(0)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition:
          'opacity .55s ease, background-color .55s ease, backdrop-filter .55s ease',
      }}
    >
      {/* a single inked print-rule across the top — fades in like a pressed
          line rather than sweeping across like a progress/loading bar */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: 1,
          width: '100%',
          // a soft ink rule, denser in the middle and feathering to nothing at
          // the edges so it reads as hand-pressed, not UI chrome
          background: `linear-gradient(90deg, transparent 0%, ${color.inkMuted} 22%, ${color.inkMuted} 78%, transparent 100%)`,
          opacity: open ? 0.18 : 0,
          transition: 'opacity .7s ease .1s',
          zIndex: 42,
        }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="panel-close"
        style={{
          position: 'fixed',
          top: 'clamp(20px,3vw,32px)',
          right: 'clamp(22px,3vw,40px)',
          zIndex: 43,
          width: 'clamp(40px,4vw,52px)',
          height: 'clamp(40px,4vw,52px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontFamily: font.mono,
          fontSize: 'clamp(28px,2.8vw,38px)',
          lineHeight: 1,
          // bare glyph — no disc, no border
          color: color.inkFaint,
          background: 'transparent',
          border: 'none',
          padding: 0,
          opacity: open ? 1 : 0,
          transition: 'opacity .5s ease .15s, color .25s ease',
        }}
      >
        <span className="x-glyph">✕</span>
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1180,
          margin: '0 auto',
          minHeight: '100%',
          padding:
            'clamp(70px,10vh,120px) clamp(26px,7vw,110px) clamp(60px,8vw,110px)',
          transform: open ? 'translateY(0)' : 'translateY(34px)',
          opacity: open ? 1 : 0,
          transition:
            'transform .65s cubic-bezier(.16,1,.3,1) .05s, opacity .55s ease .05s',
        }}
      >
        {children}
      </div>
    </div>
  )
}
