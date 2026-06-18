import { useEffect, useRef, useState } from 'react'
import type { View } from './types'
import { Textures } from './components/Textures'
import { AmbientBackground } from './components/AmbientBackground'
import { Home } from './components/Home'
import { Panel } from './components/Panel'
import { BrainPanel } from './components/panels/BrainPanel'
import { PlaygroundPanel } from './components/panels/PlaygroundPanel'
import { AboutPanel } from './components/panels/AboutPanel'

export default function App() {
  const [view, setView] = useState<View>('home')
  const open = view !== 'home'

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

  return (
    <>
      <AmbientBackground />

      <Home open={open} onOpen={setView} />

      <Panel open={open} onClose={() => setView('home')}>
        {shown === 'brain' && <BrainPanel />}
        {shown === 'play' && <PlaygroundPanel />}
        {shown === 'about' && <AboutPanel />}
      </Panel>

      <Textures halftone grain={40} />
    </>
  )
}
