import type { ReactNode } from 'react'
import { color, font } from '../styles/theme'

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * A full-screen, semi-transparent glass takeover (not a small modal). When a
 * light point is clicked the skeleton recedes (handled in Home) and this layer
 * fades + lifts into place, letting the receding figure stay faintly visible
 * behind the frosted glass. Backdrop click / ✕ / Escape all close it.
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
        background: open
          ? 'linear-gradient(180deg, rgba(9,7,4,.62) 0%, rgba(9,7,4,.78) 100%)'
          : 'rgba(9,7,4,0)',
        backdropFilter: open ? 'blur(16px) saturate(1.06)' : 'blur(0)',
        WebkitBackdropFilter: open ? 'blur(16px) saturate(1.06)' : 'blur(0)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition:
          'opacity .55s ease, background .55s ease, backdrop-filter .55s ease',
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
          // soft riso-red, denser in the middle and feathering to nothing at the
          // edges so it reads as hand-pressed ink, not a UI chrome bar
          background: `linear-gradient(90deg, transparent 0%, ${color.red} 22%, ${color.red} 78%, transparent 100%)`,
          opacity: open ? 0.5 : 0,
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
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontFamily: font.mono,
          fontSize: 22,
          lineHeight: 1,
          // bare hairline glyph — no disc, no border
          color: 'rgba(241,233,216,.5)',
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
