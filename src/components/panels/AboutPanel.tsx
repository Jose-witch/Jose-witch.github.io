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
  let order = 1

  return (
    <div>
      <PanelHeader title={about.title} />

      {/* bio + portrait — the opening row of the body, on the same grid */}
      <div
        className="about-body page-body reveal"
        style={{
          display: 'grid',
          gridTemplateColumns: '88px minmax(0, 1fr)',
          gap: 'clamp(20px,3vw,48px)',
          alignItems: 'start',
          borderTop: `0.5px solid ${color.lineSoft}`,
          paddingTop: 24,
          ['--i' as string]: order++,
        }}
      >
        <div
          className="section-label"
          style={{
            fontFamily: font.mono,
            fontSize: type.mono,
            letterSpacing: '.08em',
            textTransform: 'none',
            color: color.inkFaint,
          }}
        >
          who
        </div>

        <div className="about-bio-row">
          <div
            style={{
              margin: 0,
              fontFamily: font.serif,
              fontWeight: 400,
              fontSize: type.bodyLg,
              lineHeight: 1.62,
              color: color.inkMuted,
            }}
          >
            {about.bio.map((line, i) => (
              <p key={i} style={{ margin: line === '' ? '0.7em 0 0' : 0, minHeight: line === '' ? '0.3em' : undefined }}>
                {line}
              </p>
            ))}
          </div>

          {/* portrait sits below the verse — offset & gently tilted, less formal */}
          <figure className="about-portrait">
            <ImageSlot src={about.portrait.src} placeholder="drop image" alt={about.portrait.alt} />
            {about.portraitCaption ? (
              <figcaption
                style={{
                  marginTop: 10,
                  fontFamily: font.mono,
                  fontSize: type.mono,
                  color: color.inkFaint,
                }}
              >
                {about.portraitCaption}
              </figcaption>
            ) : null}
          </figure>
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
              borderTop: `0.5px solid ${color.lineSoft}`,
              padding: 'clamp(18px,2.2vw,26px) 0',
              ['--i' as string]: order++,
            }}
          >
            <div
              className="section-label"
              style={{
                fontFamily: font.mono,
                fontSize: type.mono,
                letterSpacing: '.08em',
                textTransform: 'none',
                color: color.inkFaint,
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
                    color: color.inkMuted,
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
                    color: color.inkMuted,
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
