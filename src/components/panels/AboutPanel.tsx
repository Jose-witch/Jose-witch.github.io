import { color, font, type } from '../../styles/theme'
import { about } from '../../data/content'
import { ImageSlot } from '../ImageSlot'
import { PanelHeader } from '../PanelHeader'

/**
 * About, rebuilt onto the shared template (§4): breadcrumb → title → serif
 * lede, then a two-column body where each fact (currently / speaks / elsewhere
 * / work / personal) is a mono section-label on the left with its content on
 * the right — exactly like Brain's ongoing/finished archive.
 */
export function AboutPanel() {
  let order = 3

  return (
    <div>
      <PanelHeader kicker={about.kicker} title={about.title} />

      {/* bio + portrait — the opening row of the body, on the same grid */}
      <div
        className="about-body page-body reveal"
        style={{
          display: 'grid',
          gridTemplateColumns: '88px minmax(0, 1fr)',
          gap: 'clamp(20px,3vw,48px)',
          alignItems: 'start',
          borderTop: `0.5px solid ${color.line}`,
          paddingTop: 24,
          ['--i' as string]: order++,
        }}
      >
        <div
          className="section-label"
          style={{
            fontFamily: font.mono,
            fontSize: type.mono,
            letterSpacing: '.05em',
            textTransform: 'uppercase',
            color: color.accent,
          }}
        >
          who
        </div>

        <div className="about-bio-row">
          <div
            className="about-portrait img-slot"
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              background: color.bgRaised,
              border: `0.5px solid ${color.line}`,
            }}
          >
            <ImageSlot src={about.portrait.src} placeholder="drop image" alt={about.portrait.alt} />
            <span
              style={{
                position: 'absolute',
                left: 0,
                bottom: -22,
                fontFamily: font.mono,
                fontSize: type.mono,
                color: color.inkFaint,
                whiteSpace: 'nowrap',
              }}
            >
              {about.portraitCaption}
            </span>
          </div>

          <p
            style={{
              margin: 0,
              fontFamily: font.serif,
              fontWeight: 400,
              fontSize: type.bodyLg,
              lineHeight: 1.62,
              color: color.ink,
            }}
          >
            {about.bio}
          </p>
        </div>
      </div>

      {/* the fact rows — one mono label per row, content on the right */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {about.sections.map((s) => (
          <section
            key={s.id}
            className="about-row page-body reveal"
            style={{
              display: 'grid',
              gridTemplateColumns: '88px minmax(0, 1fr)',
              gap: 'clamp(20px,3vw,48px)',
              alignItems: 'baseline',
              borderTop: `0.5px solid ${color.line}`,
              padding: 'clamp(18px,2.2vw,26px) 0',
              ['--i' as string]: order++,
            }}
          >
            <div
              className="section-label"
              style={{
                fontFamily: font.mono,
                fontSize: type.mono,
                letterSpacing: '.05em',
                textTransform: 'uppercase',
                color: color.accent,
              }}
            >
              {s.label}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.lines?.map((line) => (
                <span
                  key={line}
                  style={{
                    fontFamily: font.serif,
                    fontSize: type.body,
                    lineHeight: 1.4,
                    color: color.ink,
                  }}
                >
                  {line}
                </span>
              ))}
              {s.links?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="door-line"
                  style={{
                    fontFamily: font.serif,
                    fontSize: type.body,
                    lineHeight: 1.4,
                    color: color.ink,
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
