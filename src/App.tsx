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

  const enter = () => {
    if (introLeaving) return
    setIntroLeaving(true)
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* private mode — fine, it'll just show again */
    }
    // unmount after the exit transition (see Intro's 1.1s transform)
    setTimeout(() => setIntro(false), 1150)
  }

  // Re-show the overture on demand (the home's small "intro" control). Forget
  // the seen-flag and remount it fresh so the entrance replays.
  const replayIntro = () => {
    if (intro) return
    try {
      sessionStorage.removeItem(INTRO_KEY)
    } catch {
      /* ignore */
    }
    setView('home')
    setIntroLeaving(false)
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

  // On the home screen, the reverse gesture of entering the site brings the
  // intro back: wheel/trackpad up, ArrowUp/PageUp, or a downward touch swipe.
  useEffect(() => {
    if (intro || introLeaving || open) return

    const showIntro = () => replayIntro()
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -18) showIntro()
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
      if (e.touches[0].clientY - touchStartY > 32) showIntro()
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
      <Home
        open={open}
        onOpen={setView}
        dimmed={intro && !introLeaving}
        onReplayIntro={replayIntro}
      />

      <Panel open={open} onClose={() => setView('home')}>
        {shown === 'brain' && <BrainPanel />}
        {shown === 'play' && <PlaygroundPanel />}
        {shown === 'about' && <AboutPanel />}
      </Panel>

      {intro && <Intro onEnter={enter} leaving={introLeaving} />}

      <Textures halftone grain={22} />
    </>
  )
}
