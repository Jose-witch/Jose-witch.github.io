import { color, ease, dur, font, type } from '../../styles/theme'
import { brain } from '../../data/content'
import { PanelHeader } from '../PanelHeader'

export function BrainPanel() {
  // Reveal order: header occupies --i 0..2, the index picks up from there.
  let order = 3

  return (
    <div>
      <PanelHeader kicker={brain.kicker} title={brain.title} lede={brain.lede} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(48px,6vw,84px)' }}>
        {brain.groups.map((group) => (
          <section
            key={group.id}
            className="brain-section"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, 1fr) minmax(0, 4fr)',
              gap: 'clamp(20px,4vw,64px)',
              alignItems: 'start',
            }}
          >
            <header
              className="reveal"
              style={{ ['--i' as string]: order++ }}
            >
              <div
                style={{
                  fontFamily: font.code,
                  fontWeight: 500,
                  fontSize: type.caption,
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  color: color.redBright,
                  position: 'sticky',
                  top: 24,
                }}
              >
                {group.label}
                <span style={{ color: color.inkGhost, marginLeft: 8 }}>
                  {String(group.entries.length).padStart(2, '0')}
                </span>
              </div>
            </header>

            <ol
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                borderTop: `1px solid ${color.line}`,
              }}
            >
              {group.entries.map((entry, i) => (
                <li
                  key={entry.id}
                  className="reveal brain-row"
                  style={{
                    ['--i' as string]: order++,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '8px 24px',
                    padding: 'clamp(18px,2.4vw,30px) 0',
                    borderBottom: `1px solid ${color.lineSoft}`,
                    transition: `background ${dur.fast} ${ease.soft}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: font.code,
                      fontSize: type.micro,
                      letterSpacing: '.04em',
                      color: color.redBright,
                      gridColumn: '1 / 2',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div
                    className="brain-note"
                    style={{
                      fontFamily: font.code,
                      fontSize: type.micro,
                      letterSpacing: '.04em',
                      color: color.slate,
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      gridColumn: '2 / 3',
                      gridRow: '1 / 2',
                    }}
                  >
                    {entry.note}
                  </div>

                  <h3
                    style={{
                      margin: '6px 0 0',
                      gridColumn: '1 / -1',
                      fontFamily: font.display,
                      fontWeight: 700,
                      fontSize: 'clamp(24px,3.4vw,40px)',
                      lineHeight: 1.05,
                      letterSpacing: '-.01em',
                      color: color.ink,
                    }}
                  >
                    {entry.title}
                  </h3>

                  <p
                    style={{
                      margin: '4px 0 0',
                      gridColumn: '1 / -1',
                      maxWidth: 560,
                      fontFamily: font.serif,
                      fontSize: type.body,
                      lineHeight: 1.55,
                      color: 'rgba(244,236,218,.72)',
                    }}
                  >
                    {entry.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
