import type { CSSProperties } from 'react'

type Props = {
  children: string
  style?: CSSProperties
  /** Kept for API compatibility — no longer renders offset colour plates. */
  flicker?: boolean
}

/**
 * A clean display title. The old CMYK-misregister / glitch plates have been
 * removed per the redesign (§2.4) — a refined-brutalist title is pristine, the
 * weight comes from the typeface and grid, not a permanent fault filter.
 */
export function GlitchTitle({ children, style }: Props) {
  return (
    <span
      className="display-title"
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {children}
    </span>
  )
}
