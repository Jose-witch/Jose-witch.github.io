import { color, font, type } from '../../styles/theme'
import { about } from '../../data/content'
import { ImageSlot } from '../ImageSlot'
import { PanelHeader } from '../PanelHeader'

export function AboutPanel() {
  return (
    <div>
      <PanelHeader
        kicker={about.kicker}
        title={about.title}
        titleMargin="0 0 clamp(30px,4vw,46px)"
      />

      {/* A composed spread: the portrait floats into the running text, so the
          bio wraps around it like a magazine column rather than sitting in a
          rigid two-up grid. */}
      <div className="about-spread reveal" style={{ ['--i' as string]: 2 }}>
        <div
          className="about-portrait img-slot"
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            background: color.bgSlot,
            border: `1px solid rgba(236,228,206,.3)`,
          }}
        >
          <ImageSlot src={about.portrait.image} placeholder={about.portrait.placeholder} alt="portrait" />
          {/* a small plate caption, the way a work is labelled */}
          <span
            style={{
              position: 'absolute',
              left: 0,
              bottom: -24,
              fontFamily: font.code,
              fontSize: type.micro,
              color: color.slate,
              whiteSpace: 'nowrap',
            }}
          >
            Yunyou Tang, self-portrait
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: font.serif,
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: type.bodyLg,
            lineHeight: 1.62,
            color: color.ink,
          }}
        >
          {about.bio}
        </p>
      </div>

      {/* Meta — scattered as loose tags with hanging red labels, not a table. */}
      <ul
        className="about-facts reveal"
        style={{
          listStyle: 'none',
          margin: 'clamp(48px,6vw,76px) 0 clamp(40px,5vw,60px)',
          padding: 0,
          ['--i' as string]: 3,
        }}
      >
        {about.facts.map((f) => (
          <li key={f.label}>
            <span
              style={{
                display: 'block',
                fontFamily: font.code,
                fontSize: type.micro,
                letterSpacing: '.01em',
                color: color.slate,
                marginBottom: 6,
              }}
            >
              {f.label}
            </span>
            <span
              style={{
                fontFamily: font.serif,
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: type.body,
                lineHeight: 1.3,
                color: color.ink,
              }}
            >
              {f.value}
            </span>
          </li>
        ))}
      </ul>

      {/* The doors — set as a quiet line of running text, like a gallery
          colophon, rather than a ruled contact table. */}
      <div
        className="about-doors reveal"
        style={{ ['--i' as string]: 4 }}
      >
        {about.doors.map((door) => (
          <p key={door.email} style={{ margin: 0 }}>
            <span
              style={{
                fontFamily: font.code,
                fontSize: type.micro,
                letterSpacing: '.01em',
                color: color.slate,
              }}
            >
              {door.kicker}
            </span>{' '}
            <a
              href={`mailto:${door.email}`}
              className="door-line"
              style={{
                fontFamily: font.serif,
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: type.body,
                color: color.ink,
                textDecoration: 'none',
              }}
            >
              {door.email}
            </a>
          </p>
        ))}
      </div>
    </div>
  )
}
