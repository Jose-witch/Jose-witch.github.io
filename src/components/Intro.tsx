import { useEffect, useRef, useState } from 'react'
import { color, font } from '../styles/theme'
import { gesturesLocked } from '../gestureLock'

type Props = {
  /** Fired when the intro should dismiss (scroll, click, key, or wheel). */
  onEnter: () => void
  /** Drives the exit animation; parent flips this true, then unmounts later. */
  leaving: boolean
}

export function Intro({ onEnter, leaving }: Props) {
  const [ready, setReady] = useState(false)
  const fired = useRef(false)

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
      if (e.deltaY > 2 && !gesturesLocked()) enter()
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
      if (touchStartY - e.touches[0].clientY > 24 && !gesturesLocked()) enter()
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

  const enterFromClick = () => {
    if (!ready || fired.current) return
    fired.current = true
    onEnter()
  }

  return (
    <div
      onClick={enterFromClick}
      className={`intro${leaving ? ' intro--leaving' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundImage:
          'linear-gradient(180deg, rgba(5,5,5,.38) 0%, rgba(5,5,5,.08) 42%, rgba(5,5,5,.76) 100%), url("/intro.jpeg"), url("/intro.jpeg")',
        backgroundSize: '100% 100%, auto 100%, cover',
        backgroundPosition: 'center, center bottom, center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#090909',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateY(-3vh)' : 'translateY(0)',
        transition:
          'opacity .9s cubic-bezier(.4,0,.2,1), transform 1.1s cubic-bezier(.16,1,.3,1)',
        pointerEvents: leaving ? 'none' : 'auto',
      }}
    >
      <h1
        className="intro-line"
        style={{
          position: 'absolute',
          left: 'clamp(26px,6vw,84px)',
          top: 'clamp(54px,8vh,86px)',
          zIndex: 2,
          margin: 0,
          fontFamily: font.display,
          fontWeight: 600,
          fontSize: 'clamp(44px,8vw,118px)',
          letterSpacing: '-.035em',
          lineHeight: 0.92,
          color: color.ink,
          textShadow: '0 2px 24px rgba(0,0,0,.72)',
        }}
      >
        Yunyou Tang
      </h1>

      <div
        className="intro-line intro-cue"
        aria-hidden
        style={{
          position: 'absolute',
          right: 'clamp(22px,4vw,48px)',
          bottom: 'clamp(24px,4vh,44px)',
          zIndex: 2,
          fontFamily: font.mono,
          color: 'rgba(232,226,212,.72)',
          textShadow: '0 2px 16px rgba(0,0,0,.82)',
        }}
      >
        <span className="intro-cue-text">scroll</span>
        <span className="intro-cue-arrow">↓</span>
      </div>
    </div>
  )
}
