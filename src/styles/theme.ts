/**
 * Design tokens distilled from the original Claude-designed comp.
 * A warm, dark, riso-print aesthetic: cream ink on near-black, with a
 * red/blue CMYK-misregister accent and three typefaces.
 */
export const color = {
  bg: '#16110b',
  bgDeep: '#130f0a',
  bgPanel: 'rgba(23,18,12,.82)',
  bgSlot: '#14110c',
  ink: '#f4ecda',
  inkSoft: 'rgba(244,236,218,.80)',
  inkFaint: 'rgba(244,236,218,.50)',
  inkGhost: 'rgba(244,236,218,.30)',
  line: 'rgba(236,228,206,.20)',
  lineSoft: 'rgba(236,228,206,.12)',
  red: '#d8412f',
  redBright: '#e84b3a',
  blue: '#3e567f',
  blueBright: '#5b7099',
  bone: '#ece4ce',
} as const

export const font = {
  /** Syne — quirky contemporary-art display sans. Big, tight, poster-like. */
  display: "'Syne', ui-sans-serif, system-ui, sans-serif",
  /** Fraunces italic — soft serif used only as a counter-voice (sub / lede). */
  serif: "'Fraunces', 'Old Standard TT', serif",
  /** Space Grotesk — contemporary neutral sans for labels, meta, body. */
  mono: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  script: "'Caveat', cursive",
} as const

/**
 * Shared motion language. One spring-like easing for everything that moves,
 * plus a small duration scale so transitions feel like one system rather than
 * a pile of one-off numbers.
 */
export const ease = {
  /** The house easing — overshoot-free spring. Use for transforms & reveals. */
  spring: 'cubic-bezier(.16,1,.3,1)',
  /** Calmer ease for opacity-only crossfades. */
  soft: 'cubic-bezier(.4,0,.2,1)',
} as const

export const dur = {
  fast: '.25s',
  base: '.45s',
  slow: '.65s',
  glacial: '.85s',
} as const

/** A fluid type scale — clamp(min, fluid, max), in px. */
export const type = {
  micro: 'clamp(12px,1.2vw,13.5px)',
  caption: 'clamp(14px,1.5vw,15.5px)',
  body: 'clamp(16px,1.7vw,18px)',
  bodyLg: 'clamp(18px,2.1vw,23px)',
  lede: 'clamp(19px,2.2vw,25px)',
  h3: 'clamp(20px,2.3vw,26px)',
  display: 'clamp(40px,6.4vw,84px)',
  displaySm: 'clamp(26px,3.6vw,50px)',
} as const

/** Pixels of CMYK plate misregistration on the layered display titles. */
export const MISREGISTER = 3

/**
 * The two offset color "plates" behind a title. Stack a red + blue copy
 * underneath the crisp foreground copy to fake an off-register print run.
 */
export function platePositions(mr: number = MISREGISTER) {
  const y = Math.round(mr * 0.55)
  return {
    red: {
      position: 'absolute',
      left: 0,
      top: 0,
      color: color.red,
      opacity: 0.85,
      transform: `translate(${mr}px, ${y}px)`,
    },
    blue: {
      position: 'absolute',
      left: 0,
      top: 0,
      color: color.blue,
      opacity: 0.8,
      transform: `translate(${-mr}px, ${-y}px)`,
    },
  } as const
}
