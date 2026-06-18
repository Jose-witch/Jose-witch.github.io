/**
 * Design tokens — refined brutalist.
 *
 * Near-black ground, warm-white ink in two muted greys, and ONE de-saturated
 * brick red used sparingly (hover / current / index numerals / breadcrumb
 * arrow). No second accent. The look comes from a strict grid + clear type
 * roles, not from decoration. See pillow-witch-redesign-spec.md.
 */
export const color = {
  /* backgrounds — lifted off pure black, never #000 */
  bg: '#161616',
  bgRaised: '#1e1d1b',
  bgSunken: '#111110',
  /* legacy aliases kept so older call-sites resolve to the new ground */
  bgDeep: '#111110',
  bgPanel: 'rgba(22,22,22,.82)',
  bgSlot: '#1e1d1b',

  /* ink — warm white + two greys, never pure white */
  ink: '#e8e2d4',
  inkSoft: '#9c958a',
  inkMuted: '#9c958a',
  inkFaint: '#5f5a52',
  inkGhost: 'rgba(232,226,212,.22)',

  /* one accent — a de-saturated brick / dark wine red, used scarcely */
  accent: '#8c2f24',
  accentDim: '#5c241d',
  /* legacy aliases → all collapse onto the single brick accent */
  red: '#8c2f24',
  redBright: '#a23a2d',
  slate: '#9c958a',
  slateSoft: 'rgba(156,149,138,.72)',
  bone: '#e8e2d4',

  /* lines — extremely fine */
  line: '#2e2a26',
  lineSoft: 'rgba(46,42,38,.7)',
  lineStrong: '#423c35',
} as const

export const font = {
  /** Space Grotesk — the display voice: page titles, post titles, the name.
   *  "you, the person." Set tight. */
  display: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  /** Newsreader — humanist serif, italic for ledes: "the inner voice writing." */
  serif: "'Newsreader', 'Noto Serif SC', 'Songti SC', serif",
  /** Space Mono — the instrument voice: breadcrumbs, dates, section labels,
   *  status tags, index numerals. "the machine annotating." */
  mono: "'Space Mono', ui-monospace, 'SF Mono', Menlo, monospace",
  /** legacy alias — `code` was a separate monospace; now folded into mono. */
  code: "'Space Mono', ui-monospace, 'SF Mono', Menlo, monospace",
} as const

/**
 * Shared motion language. One spring-like easing for transforms/reveals, a
 * calmer ease for opacity crossfades.
 */
export const ease = {
  spring: 'cubic-bezier(.16,1,.3,1)',
  soft: 'cubic-bezier(.4,0,.2,1)',
} as const

export const dur = {
  fast: '.25s',
  base: '.45s',
  slow: '.65s',
  glacial: '.85s',
} as const

/** Fluid type scale — clamp(min, fluid, max). */
export const type = {
  mono: 'clamp(11px,1.1vw,12px)',
  micro: 'clamp(11px,1.1vw,12px)',
  small: 'clamp(12px,1.3vw,13px)',
  caption: 'clamp(12px,1.3vw,13px)',
  body: 'clamp(15px,1.6vw,16px)',
  bodyLg: 'clamp(16px,1.8vw,18px)',
  lede: 'clamp(16px,1.9vw,19px)',
  h3: 'clamp(20px,2.2vw,28px)',
  h2: 'clamp(22px,2.6vw,28px)',
  display: 'clamp(40px,6vw,88px)',
  displaySm: 'clamp(26px,3.4vw,44px)',
} as const

/** Spacing scale. */
export const space = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '48px',
  xl: '96px',
} as const

/** Global small radius — brutalist leans square; never large rounding. */
export const radius = '4px'
