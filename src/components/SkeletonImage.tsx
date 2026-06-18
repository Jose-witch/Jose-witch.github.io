import type { CSSProperties } from 'react'
import skeleton from '../assets/skeleton.png'

/**
 * The riso/engraving skeleton — a complete, symmetric 3/4 rear-view figure
 * (1024×1536) with both hands intact and a TRANSPARENT background, so it sits
 * seamlessly on the dark page. Rendered with a breathing glow the parent
 * drives via `glow` (0..1).
 */
type Props = {
  glow?: number
  style?: CSSProperties
}

const glowFilter = (g: number) =>
  `brightness(${1 + g * 0.12}) drop-shadow(0 0 ${10 + g * 24}px rgba(140,47,36,.2))`

export function SkeletonImage({ glow = 0.5, style }: Props) {
  return (
    <img
      src={skeleton}
      alt="anatomical skeleton"
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        objectFit: 'contain',
        filter: glowFilter(glow),
        ...style,
      }}
    />
  )
}
