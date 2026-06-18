import { color, font, type } from '../styles/theme'

type Props = {
  kicker: string
  title: string
  lede?: string
  /** About has a larger bottom margin on the title. */
  titleMargin?: string
}

/**
 * The shared page header (§4): breadcrumb (mono, accent) → display title →
 * serif-italic lede. Each page on the site opens with this exact stack so the
 * four views read as one system.
 */
export function PanelHeader({ kicker, title, lede, titleMargin }: Props) {
  return (
    <>
      <div
        className="reveal"
        style={{
          fontFamily: font.mono,
          fontWeight: 400,
          fontSize: type.mono,
          letterSpacing: '.04em',
          textTransform: 'uppercase',
          color: color.accent,
          marginBottom: 20,
          ['--i' as string]: 0,
        }}
      >
        {kicker}
      </div>
      <div className="reveal" style={{ ['--i' as string]: 1 }}>
        <span
          className="display-title"
          style={{
            display: 'inline-block',
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: type.display,
            color: color.ink,
            margin: titleMargin ?? '0',
          }}
        >
          {title}
        </span>
      </div>
      {lede && (
        <p
          className="reveal"
          style={{
            maxWidth: 360,
            fontFamily: font.serif,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: type.lede,
            lineHeight: 1.5,
            color: color.inkMuted,
            margin: '20px 0 clamp(34px,4vw,52px)',
            ['--i' as string]: 2,
          }}
        >
          {lede}
        </p>
      )}
    </>
  )
}
