import { color, ease, dur, font, type } from '../../styles/theme'
import { brain } from '../../data/content'
import { PanelHeader } from '../PanelHeader'

export function BrainPanel() {
  // Reveal order: header occupies --i 0..2, the index picks up from there.
  let order = 3

  return (
    <div>
      <PanelHeader kicker={brain.kicker} title={brain.title} lede={brain.lede} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(40px,5vw,72px)' }}>
        {brain.groups.map((group) => (
          <section
            key={group.id}
            className="brain-section page-body"
            style={{
              display: 'grid',
              gridTemplateColumns: '88px minmax(0, 1fr)',
              gap: 'clamp(20px,3vw,48px)',
              alignItems: 'start',
              borderTop: `0.5px solid ${color.line}`,
              paddingTop: 24,
            }}
          >
            <header className="reveal" style={{ ['--i' as string]: order++ }}>
              <div
                className="section-label"
                style={{
                  fontFamily: font.mono,
                  fontWeight: 400,
                  fontSize: type.mono,
                  letterSpacing: '.05em',
                  textTransform: 'uppercase',
                  color: color.accent,
                  position: 'sticky',
                  top: 24,
                }}
              >
                {group.label}
                <span style={{ color: color.inkFaint, marginLeft: 8 }}>
                  {String(group.entries.length).padStart(2, '0')}
                </span>
              </div>
            </header>

            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {group.entries.map((entry, i) => (
                <li
                  key={entry.id}
                  className="reveal brain-row"
                  style={{
                    ['--i' as string]: order++,
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '6px 24px',
                    padding: 'clamp(18px,2.2vw,28px) 0',
                    borderBottom: `0.5px solid ${color.line}`,
                    transition: `background ${dur.fast} ${ease.soft}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: font.mono,
                      fontSize: type.mono,
                      letterSpacing: '.04em',
                      color: color.accent,
                      gridColumn: '1 / 2',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div
                    className="brain-note"
                    style={{
                      fontFamily: font.mono,
                      fontSize: type.mono,
                      letterSpacing: '.04em',
                      textTransform: 'uppercase',
                      color: color.inkFaint,
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
                      fontWeight: 600,
                      fontSize: 'clamp(22px,3vw,36px)',
                      lineHeight: 1.05,
                      letterSpacing: '-.02em',
                      color: color.ink,
                    }}
                  >
                    {entry.title}
                  </h3>

                  <p
                    style={{
                      margin: '6px 0 0',
                      gridColumn: '1 / -1',
                      maxWidth: 560,
                      fontFamily: font.serif,
                      fontSize: type.body,
                      lineHeight: 1.55,
                      color: color.inkMuted,
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
