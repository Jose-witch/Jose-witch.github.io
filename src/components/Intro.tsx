import { useEffect, useRef, useState } from 'react'
import { color, font } from '../styles/theme'

type Props = {
  /** Fired when the intro should dismiss (scroll, click, key, or wheel). */
  onEnter: () => void
  /** Drives the exit animation — parent flips this true, then unmounts later. */
  leaving: boolean
}

/**
 * The landing overture — a quiet full-screen prelude shown once per session.
 * A name set large and tight, a serif-italic line, and a wide-tracked
 * "( scroll )" cue. Any forward gesture (wheel down, click, ↓ / Enter / Space)
 * "lands" the visitor into the skeleton navigation behind it. The skeleton is
 * already present, ghosted, so the exit reads as one continuous develop-in
 * rather than two separate screens.
 */
export function Intro({ onEnter, leaving }: Props) {
  const [ready, setReady] = useState(false)
  const fired = useRef(false)

  // Let the entrance settle before arming dismissal, so an inertial trackpad
  // fling that carried the user here doesn't immediately skip the overture.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!ready) return
    const enter = () => {
      if (fired.current) return
      fired.current = true
      onEnter()
    }
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 2) enter()
    }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'Enter', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault()
        enter()
      }
    }
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => (touchStartY = e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY - e.touches[0].clientY > 24) enter()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [ready, onEnter])

  return (
    <div
      onClick={() => ready && !fired.current && (fired.current = true, onEnter())}
      className={`intro${leaving ? ' intro--leaving' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        // a touch deeper than the home ground, so landing reads as a slow
        // "lights coming up" lift from sunken → base
        background:
          'radial-gradient(130% 120% at 50% 46%, rgba(17,17,16,.72) 0%, rgba(17,17,16,.92) 70%, #111110 100%)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateY(-3vh)' : 'translateY(0)',
        transition:
          'opacity .9s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.16,1,.3,1)',
        pointerEvents: leaving ? 'none' : 'auto',
      }}
    >
      {/* ── edge notes: a cover-page colophon framing the big type ──────────── */}
      <span className="intro-line intro-edge intro-edge--tl">Pillow Witch</span>
      <span className="intro-line intro-edge intro-edge--tr">Berlin · 2025</span>
      <span className="intro-line intro-edge intro-edge--bl">
        Doctoral researcher · neurology
      </span>

      {/* ── centre stack ───────────────────────────────────────────────────── */}
      <div className="intro-line intro-kicker">
        <span className="intro-kicker-rule" aria-hidden />
        portfolio · index
        <span className="intro-kicker-rule" aria-hidden />
      </div>

      <h1
        className="intro-line intro-name"
        style={{
          margin: 0,
          fontFamily: font.display,
          fontWeight: 600,
          fontSize: 'clamp(52px,11vw,150px)',
          letterSpacing: '-.035em',
          lineHeight: 0.92,
          color: color.ink,
        }}
      >
        Yunyou Tang
      </h1>

      {/* a preview of the anatomy entrances — fills the lower centre and plants
          the navigation metaphor before the skeleton even appears */}
      <ul className="intro-line intro-entries" aria-hidden>
        {ENTRIES.map((e) => (
          <li key={e.n} className="intro-entry">
            <span className="intro-entry-n">{e.n}</span>
            <span className="intro-entry-part">{e.part}</span>
            <span className="intro-entry-name">{e.name}</span>
          </li>
        ))}
      </ul>

      {/* scroll cue — bottom-right corner */}
      <div className="intro-line intro-cue intro-edge--br" aria-hidden>
        <span className="intro-cue-text">scroll</span>
        <span className="intro-cue-arrow">↓</span>
      </div>
    </div>
  )
}

const ENTRIES = [
  { n: '01', part: 'the skull', name: 'Brain project' },
  { n: '02', part: 'the heart', name: 'Playground' },
  { n: '03', part: 'the feet', name: 'About' },
] as const
