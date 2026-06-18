import type { CSSProperties } from 'react'
import { platePositions } from '../styles/theme'

type Props = {
  children: string
  style?: CSSProperties
  /** Adds occasional CMYK-shear glitch bursts on the offset plates. */
  flicker?: boolean
}

/**
 * A title rendered as three stacked copies — an offset red plate, an offset
 * blue plate, and a crisp foreground copy — to mimic an off-register riso
 * print. With `flicker`, the colour plates jitter/shear on a loop for a
 * heavier glitch-art feel. Wrapper is `position: relative; inline-block`.
 */
export function GlitchTitle({ children, style, flicker }: Props) {
  const plates = platePositions()
  return (
    <span
      className={`display-title${flicker ? ' glitch' : ''}`}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      <span aria-hidden className={flicker ? 'glitch-red' : undefined} style={plates.red}>
        {children}
      </span>
      <span aria-hidden className={flicker ? 'glitch-blue' : undefined} style={plates.blue}>
        {children}
      </span>
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  )
}
