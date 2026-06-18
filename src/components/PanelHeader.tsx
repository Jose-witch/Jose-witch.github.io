import { color, font, type } from '../styles/theme'
import { GlitchTitle } from './GlitchTitle'

type Props = {
  kicker: string
  title: string
  lede?: string
  /** About has no lede and uses a larger bottom margin on the title. */
  titleMargin?: string
}

export function PanelHeader({ kicker, title, lede, titleMargin }: Props) {
  return (
    <>
      <div
        className="reveal"
        style={{
          fontFamily: font.code,
          fontWeight: 400,
          fontSize: type.caption,
          letterSpacing: '.01em',
          color: color.redBright,
          marginBottom: 18,
          ['--i' as string]: 0,
        }}
      >
        {kicker}
      </div>
      <div className="reveal" style={{ ['--i' as string]: 1 }}>
        <GlitchTitle
          flicker
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: type.display,
            color: color.ink,
            margin: titleMargin ?? '0',
          }}
        >
          {title}
        </GlitchTitle>
      </div>
      {lede && (
        <p
          className="reveal"
          style={{
            maxWidth: 640,
            fontFamily: font.serif,
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: type.lede,
            lineHeight: 1.6,
            color: color.inkSoft,
            margin: '22px 0 clamp(34px,4vw,52px)',
            ['--i' as string]: 2,
          }}
        >
          {lede}
        </p>
      )}
    </>
  )
}
