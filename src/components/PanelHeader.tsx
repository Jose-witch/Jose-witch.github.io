import { color, font, type } from '../styles/theme'

type Props = {
  title: string
  lede?: string
  /** About has a larger bottom margin on the title. */
  titleMargin?: string
}

/**
 * The shared page header (§4): display title → optional serif-italic lede.
 * Each page on the site opens with this exact stack so the views read as one
 * system.
 */
export function PanelHeader({ title, lede, titleMargin }: Props) {
  return (
    <>
      <div className="reveal" style={{ ['--i' as string]: 0 }}>
        <span
          className="display-title"
          style={{
            display: 'inline-block',
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: type.display,
            color: color.ink,
            textShadow: '0 2px 24px rgba(0,0,0,.62)',
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
            ['--i' as string]: 1,
          }}
        >
          {lede}
        </p>
      )}
    </>
  )
}
