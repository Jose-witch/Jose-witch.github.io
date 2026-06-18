import { color, font } from '../../styles/theme'
import { playground } from '../../data/content'
import { ImageSlot } from '../ImageSlot'
import { PanelHeader } from '../PanelHeader'

export function PlaygroundPanel() {
  return (
    <div>
      <PanelHeader kicker={playground.kicker} title={playground.title} lede={playground.lede} />

      {/* masonry-ish columns of tilted photos */}
      <div
        style={{
          columns: 'clamp(190px,24vw,260px)',
          columnGap: 'clamp(18px,2.4vw,32px)',
        }}
      >
        {playground.items.map((item, i) => (
          <div
            key={item.id}
            className="reveal"
            style={{
              breakInside: 'avoid',
              margin: '0 0 clamp(20px,2.6vw,32px)',
              ['--i' as string]: i + 3,
            }}
          >
            {/* rotation lives on an inner wrapper so it survives the rise-in */}
            <div style={{ transform: `rotate(${item.rotate}deg)` }}>
              <div
                className="img-slot"
                style={{
                  position: 'relative',
                  aspectRatio: item.aspect,
                  // empty slots read as a dashed "drop here" frame with an even
                  // fill, so they don't dissolve into the ambient vignette and
                  // leave only a stray border line at the bottom of the grid
                  background: item.image ? color.bgSlot : 'rgba(236,228,206,.06)',
                  border: item.image
                    ? `1px solid rgba(236,228,206,.26)`
                    : `1px dashed rgba(236,228,206,.28)`,
                }}
              >
                <ImageSlot src={item.image} placeholder={item.placeholder} alt={item.caption} />
              </div>
              <div
                style={{
                  fontFamily: font.serif,
                  fontStyle: 'italic',
                  fontSize: 'clamp(15px,1.15vw,17px)',
                  letterSpacing: '.01em',
                  lineHeight: 1.35,
                  color: color.inkSoft,
                  marginTop: 10,
                }}
              >
                {item.caption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
