import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { color, font } from '../styles/theme'
import { GlitchTitle } from './GlitchTitle'
import { SkeletonImage } from './SkeletonImage'
import type { View } from '../types'

type Point = {
  view: Exclude<View, 'home'>
  title: string
  hint: string
  /** Position on the skeleton box, as % of the SVG viewBox. */
  top: string
  left: string
  delay: string
  /** Which side of the dot the label extends toward, into clear space. */
  side: 'left' | 'right'
}

// Anchors on the skeleton image (1024×1536, complete + transparent figure).
const POINTS: Point[] = [
  { view: 'brain', title: 'Brain Project', hint: 'the skull', top: '6.5%', left: '33%', delay: '0s', side: 'right' },
  { view: 'play', title: 'Playground', hint: 'the heart', top: '22%', left: '33%', delay: '.5s', side: 'left' },
  { view: 'about', title: 'About', hint: 'the feet', top: '92%', left: '47%', delay: '1s', side: 'left' },
]

// Generous, invisible hit area (44×44 — a comfortable touch target) with the
// small glowing core centred inside, so the dot is easy to click without
// having to land precisely on the 16px light.
const HIT = 44
const dotStyle: CSSProperties = {
  position: 'absolute',
  width: HIT,
  height: HIT,
  margin: `${-HIT / 2}px 0 0 ${-HIT / 2}px`,
  zIndex: 7,
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const coreStyle: CSSProperties = {
  background: 'radial-gradient(circle,#e8e2d4 0%,#a23a2d 46%,rgba(140,47,36,0) 74%)',
  boxShadow: '0 0 14px 2px rgba(140,47,36,.6)',
}

type Props = {
  open: boolean
  onOpen: (view: Exclude<View, 'home'>) => void
  /** While the landing overture is up, the home is ghosted behind it. */
  dimmed?: boolean
  /** Re-show the landing overture. */
  onReplayIntro?: () => void
}

export function Home({ open, onOpen, dimmed = false, onReplayIntro }: Props) {
  // Pointer-driven parallax + a slow breathing glow on the bones.
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState(0.55)
  const raf = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => setTilt({ x: nx, y: ny }))
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  // Breathing glow.
  useEffect(() => {
    let frame = 0
    const tick = () => {
      const t = performance.now() / 1000
      setGlow(0.5 + Math.sin(t * 1.1) * 0.28)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        // A near-black wash, denser at the centre where the masthead + figure
        // live so the ambient layer never fights the type.
        background:
          'radial-gradient(135% 120% at 50% 46%, rgba(22,22,22,.7) 0%, rgba(20,20,20,.5) 58%, rgba(17,17,16,.26) 100%)',
      }}
    >
      {/* a quiet way back to the overture — bottom-left corner note */}
      {onReplayIntro && (
        <button
          type="button"
          onClick={onReplayIntro}
          className="home-intro-link"
          aria-label="Replay intro"
          style={{
            position: 'absolute',
            bottom: 'clamp(22px,4vh,40px)',
            left: 'clamp(26px,6vw,84px)',
            zIndex: 6,
            opacity: open || dimmed ? 0 : 1,
            pointerEvents: open || dimmed ? 'none' : 'auto',
            transition: 'opacity .6s ease .2s',
          }}
        >
          <span aria-hidden style={{ color: color.accent, marginRight: 8 }}>↑</span>
          intro
        </button>
      )}

      {/* edge vignette — pools light onto the central figure */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 44%, transparent 52%, rgba(10,10,10,.55) 100%)',
        }}
      />

      {/* title block — a left-hand text column, vertically centred */}
      <div
        className="home-masthead"
        style={{
          position: 'absolute',
          top: '50%',
          left: 'clamp(26px,6vw,84px)',
          maxWidth: 'min(46vw, 520px)',
          zIndex: 6,
          transform: open
            ? 'translateY(calc(-50% - 12px))'
            : dimmed
              ? 'translateY(calc(-50% + 10px))'
              : 'translateY(-50%)',
          // hidden behind the overture, then settles in just after it lifts
          opacity: open || dimmed ? 0 : 1,
          transition:
            'opacity .7s ease .1s, transform .9s cubic-bezier(.16,1,.3,1) .1s',
          pointerEvents: open || dimmed ? 'none' : 'auto',
        }}
      >
        <GlitchTitle
          style={{
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: 'clamp(44px,6vw,86px)',
            letterSpacing: '-.02em',
            color: color.ink,
          }}
        >
          Yunyou Tang
        </GlitchTitle>
        <div
          style={{
            fontFamily: font.serif,
            fontStyle: 'italic',
            fontWeight: 400,
            color: color.inkMuted,
            fontSize: 'clamp(18px,2.2vw,24px)',
            lineHeight: 1.1,
            margin: '14px 0 0 2px',
            letterSpacing: '.01em',
          }}
        >
          Pillow Witch
        </div>
        <div
          style={{
            fontFamily: font.mono,
            fontWeight: 400,
            fontSize: 'clamp(11px,1.2vw,13px)',
            letterSpacing: '.02em',
            lineHeight: 1.65,
            color: color.inkFaint,
            marginTop: 26,
          }}
        >
          Doctoral researcher in neurology
          <div style={{ marginTop: 4 }}>@ Charité – Universitätsmedizin Berlin</div>
        </div>

        {/* phones only (.home-nav, hidden ≥600px): a real, tappable text menu —
            the on-bone dots are too small to hit reliably on touch */}
        <nav className="home-nav" aria-label="Sections" style={{ marginTop: 30 }}>
          {POINTS.map((p) => (
            <button
              key={p.view}
              type="button"
              className="home-nav-item"
              onClick={() => onOpen(p.view)}
            >
              <span
                className="home-nav-hint"
                style={{
                  fontFamily: font.mono,
                  fontSize: 12,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  color: color.inkFaint,
                  whiteSpace: 'nowrap',
                }}
              >
                {p.hint}
              </span>
              <span
                style={{
                  fontFamily: font.display,
                  fontWeight: 600,
                  fontSize: 'clamp(20px,6vw,26px)',
                  lineHeight: 1,
                  color: color.ink,
                  marginLeft: 'auto',
                }}
              >
                {p.title}
              </span>
              <span
                aria-hidden
                style={{ color: color.inkFaint, fontFamily: font.code, fontSize: 14 }}
              >
                →
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* skeleton stage — biased right on wide screens (see .home-stage) */}
      <div
        className="home-stage"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          perspective: '1500px',
        }}
      >
        <div
          className="home-figure"
          style={{
            position: 'relative',
            aspectRatio: '1024 / 1536',
            height: 'min(92vh, calc(78vw * 1.5), 1010px)',
            transformStyle: 'preserve-3d',
            // A gentle parallax *drift* — the figure floats with the pointer but
            // always stays face-on. The earlier rotateX/Y tilted a flat image in
            // 3D, which read as a paper cut-out turning to show it had no depth;
            // pure translation keeps the float without ever exposing the plane.
            transform: open
              ? 'scale(1.12) translateZ(0)'
              : dimmed
                ? 'scale(1.04)'
                : `translate(${tilt.x * -22}px, ${tilt.y * -16}px) scale(1.012)`,
            // ghosted behind the overture → develops to full as it lifts
            opacity: open ? 0.14 : dimmed ? 0.28 : 1,
            filter: open
              ? 'blur(7px) saturate(.6)'
              : dimmed
                ? 'blur(5px) saturate(.7)'
                : 'none',
            transition:
              'transform 1s cubic-bezier(.16,1,.3,1), opacity .9s ease, filter .9s ease',
          }}
        >
          <SkeletonImage glow={glow} style={{ display: 'block' }} />

          <div
            style={{
              opacity: open || dimmed ? 0 : 1,
              pointerEvents: open || dimmed ? 'none' : 'auto',
              transition: 'opacity .5s ease .15s',
            }}
          >
            {POINTS.map((p) => (
              <div
                key={p.view}
                className="light-point-wrap"
                style={{ position: 'absolute', top: p.top, left: p.left }}
              >
                <button
                  type="button"
                  onClick={() => onOpen(p.view)}
                  title={p.title}
                  aria-label={p.title}
                  className="light-point"
                  style={{ ...dotStyle, animationDelay: p.delay }}
                >
                  <span className="core" style={{ ...coreStyle, animationDelay: p.delay }} />
                </button>
                {/* always-visible hint label — itself clickable, on the side
                    that has clear space */}
                <button
                  type="button"
                  onClick={() => onOpen(p.view)}
                  aria-label={p.title}
                  className={`point-label point-label--${p.side}`}
                  style={{
                    position: 'absolute',
                    top: -8,
                    // pushed well clear of the dot so the hint text never
                    // sits over the bone the dot is anchored to
                    ...(p.side === 'right' ? { left: 30 } : { right: 30 }),
                    whiteSpace: 'nowrap',
                    textAlign: p.side === 'right' ? 'left' : 'right',
                    fontFamily: font.code,
                    fontSize: 13.5,
                    letterSpacing: '.01em',
                    color: color.ink,
                    padding: '5px 11px',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    animationDelay: p.delay,
                    cursor: 'pointer',
                  }}
                >
                  {p.side === 'right' ? (
                    <>
                      <span className="point-hint">{p.hint}</span>
                      <span style={{ color: color.inkFaint, margin: '0 7px' }}>→</span>
                      {p.title}
                    </>
                  ) : (
                    <>
                      {p.title}
                      <span style={{ color: color.inkFaint, margin: '0 7px' }}>←</span>
                      <span className="point-hint">{p.hint}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
