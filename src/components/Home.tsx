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
  background: 'radial-gradient(circle,#fff 0%,#e84b3a 44%,rgba(216,65,47,0) 74%)',
  boxShadow: '0 0 16px 3px rgba(232,75,58,.7)',
}

type Props = {
  open: boolean
  onOpen: (view: Exclude<View, 'home'>) => void
}

export function Home({ open, onOpen }: Props) {
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
        // A warm-dark wash that lets the flowing ink (z-index 0) read clearly at
        // the edges while staying denser at the centre, where the masthead +
        // figure live, so the ink never fights the type.
        background:
          'radial-gradient(135% 120% at 50% 46%, rgba(20,16,10,.66) 0%, rgba(18,14,9,.5) 58%, rgba(15,12,8,.26) 100%)',
      }}
    >
      {/* edge vignette — pools light onto the central figure */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 100% at 50% 44%, transparent 52%, rgba(8,6,3,.5) 100%)',
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
          transform: open ? 'translateY(calc(-50% - 12px))' : 'translateY(-50%)',
          opacity: open ? 0 : 1,
          transition: 'opacity .5s ease, transform .6s cubic-bezier(.16,1,.3,1)',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <GlitchTitle
          flicker
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 'clamp(44px,6vw,86px)',
            color: color.ink,
          }}
        >
          Yunyou Tang
        </GlitchTitle>
        <div
          style={{
            fontFamily: font.serif,
            fontStyle: 'normal',
            fontWeight: 500,
            color: color.red,
            fontSize: 'clamp(18px,2.2vw,26px)',
            lineHeight: 1.1,
            margin: '16px 0 0 2px',
            letterSpacing: '.01em',
          }}
        >
          Pillow Witch
        </div>
        <div
          style={{
            fontFamily: font.mono,
            fontWeight: 500,
            fontSize: 'clamp(13px,1.4vw,15px)',
            letterSpacing: '.04em',
            lineHeight: 1.65,
            color: color.inkFaint,
            marginTop: 26,
          }}
        >
          Doctoral Researcher in Neurology
        </div>
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
              : `translate(${tilt.x * -22}px, ${tilt.y * -16}px) scale(1.012)`,
            opacity: open ? 0.14 : 1,
            filter: open ? 'blur(7px) saturate(.6)' : 'none',
            transition:
              'transform .7s cubic-bezier(.16,1,.3,1), opacity .6s ease, filter .6s ease',
          }}
        >
          <SkeletonImage glow={glow} style={{ display: 'block' }} />

          <div
            style={{
              opacity: open ? 0 : 1,
              pointerEvents: open ? 'none' : 'auto',
              transition: 'opacity .4s ease',
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
                    fontFamily: font.mono,
                    fontSize: 15,
                    letterSpacing: '.02em',
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
                      <span style={{ color: color.redBright }}>{p.hint}</span>
                      <span style={{ color: color.inkFaint, margin: '0 7px' }}>→</span>
                      {p.title}
                    </>
                  ) : (
                    <>
                      {p.title}
                      <span style={{ color: color.inkFaint, margin: '0 7px' }}>←</span>
                      <span style={{ color: color.redBright }}>{p.hint}</span>
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
