import { useEffect, useRef } from 'react'

type Props = {
  /** Halftone dot overlay on/off. */
  halftone?: boolean
  /** Film-grain opacity, 0–100. */
  grain?: number
}

/**
 * Two fixed, pointer-transparent overlays that sit above everything:
 * a multiply-blended halftone dot screen and an overlay-blended film grain
 * generated once on a canvas.
 */
export function Textures({ halftone = true, grain = 22 }: Props) {
  const grainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = grainRef.current
    if (!el) return
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 150
      canvas.height = 150
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const img = ctx.createImageData(150, 150)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = Math.random() * 44
      }
      ctx.putImageData(img, 0, 0)
      el.style.backgroundImage = `url(${canvas.toDataURL()})`
    } catch {
      /* canvas unavailable — skip grain */
    }
  }, [])

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 30,
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          backgroundImage: 'radial-gradient(#000 0.7px, transparent 1.3px)',
          backgroundSize: '4px 4px',
          opacity: halftone ? 0.035 : 0,
        }}
      />
      <div
        ref={grainRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 31,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          backgroundRepeat: 'repeat',
          opacity: grain / 100,
        }}
      />
    </>
  )
}
