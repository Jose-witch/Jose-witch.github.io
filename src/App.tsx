import { useEffect, useRef, useState } from 'react'
import type { View } from './types'
import { Textures } from './components/Textures'
import { AmbientBackground } from './components/AmbientBackground'
import { Intro } from './components/Intro'
import { Home } from './components/Home'
import { Panel } from './components/Panel'
import { BrainPanel } from './components/panels/BrainPanel'
import { PlaygroundPanel } from './components/panels/PlaygroundPanel'
import { AboutPanel } from './components/panels/AboutPanel'
import { lockGestures, gesturesLocked } from './gestureLock'

const INTRO_KEY = 'pw-intro-seen'

export default function App() {
  const [view, setView] = useState<View>('home')
  const open = view !== 'home'

  // Landing overture — shown once per browser session. `intro` = overture is
  // mounted & interactive; `leaving` plays the exit before we unmount it so the
  // home page develops in as the prelude lifts away.
  const [intro, setIntro] = useState(() => {
    if (typeof sessionStorage === 'undefined') return true
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  })
  const [introLeaving, setIntroLeaving] = useState(false)
  // Bumped on every replay so React remounts <Intro> fresh, resetting its
  // internal `fired` guard — otherwise the second visit would be inert.
  const [introRun, setIntroRun] = useState(0)


  const enter = () => {
    if (introLeaving) return
    lockGestures()
    setIntroLeaving(true)
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* private mode — fine, it'll just show again */
    }
    // unmount after the exit transition (see Intro's 1.1s transform), then
    // clear the leaving flag so the home-screen gesture listeners re-arm —
    // otherwise `introLeaving` stays true and swiping up never works again.
    setTimeout(() => {
      setIntro(false)
      setIntroLeaving(false)
    }, 1150)
  }

  // Re-show the overture on demand (the home's small "intro" control). Forget
  // the seen-flag and remount it fresh so the entrance replays.
  const replayIntro = () => {
    if (intro) return
    lockGestures()
    try {
      sessionStorage.removeItem(INTRO_KEY)
    } catch {
      /* ignore */
    }
    setView('home')
    setIntroLeaving(false)
    setIntroRun((n) => n + 1)
    setIntro(true)
  }

  // Remember the last opened section so its content stays rendered while the
  // panel fades out, instead of vanishing the instant we return to home.
  const lastPanel = useRef<Exclude<View, 'home'>>('brain')
  if (open) lastPanel.current = view
  const shown = open ? view : lastPanel.current

  // Escape closes any open panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('home')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // On the home screen, an upward swipe (mouse wheel or touch) brings the intro
  // back — finger/content moves up, the same direction you'd push the home page
  // away. Also bound to ArrowUp/PageUp/Home for keyboards.
  useEffect(() => {
    if (intro || introLeaving || open) return

    const showIntro = () => replayIntro()
    const onWheel = (e: WheelEvent) => {
      // scroll/swipe up = deltaY negative
      if (e.deltaY < -18 && !gesturesLocked()) showIntro()
    }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'PageUp', 'Home'].includes(e.key)) {
        e.preventDefault()
        showIntro()
      }
    }
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      // swipe up: finger travels upward, so clientY decreases
      if (touchStartY - e.touches[0].clientY > 32 && !gesturesLocked()) showIntro()
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
  }, [intro, introLeaving, open])

  return (
    <>
      <AmbientBackground />

      {/* While the overture is up, the home page is ghosted behind it; it
          resolves to full as the overture lifts (handled via the `intro` flag
          passed to Home). */}
      <Home open={open} onOpen={setView} dimmed={intro && !introLeaving} />

      <Panel open={open} onClose={() => setView('home')}>
        {shown === 'brain' && <BrainPanel />}
        {shown === 'play' && <PlaygroundPanel />}
        {shown === 'about' && <AboutPanel />}
      </Panel>

      {intro && <Intro key={introRun} onEnter={enter} leaving={introLeaving} />}

      <Textures halftone grain={22} />
    </>
  )
}
