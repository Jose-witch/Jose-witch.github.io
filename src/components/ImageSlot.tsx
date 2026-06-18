import { color, font, type } from '../styles/theme'

type Props = {
  src?: string
  alt?: string
  placeholder?: string
  /**
   * How the image fills its slot:
   *   - 'cover'   (default) crops to fill — used for the tidy masonry covers.
   *   - 'contain' shows the whole image (may letterbox) — used when viewing
   *     a photo full-size so nothing is cropped away.
   */
  fit?: 'cover' | 'contain'
}

/**
 * A bordered slot that shows a `src` image when provided, or a dashed-feel
 * placeholder label otherwise. Fills its positioned parent.
 */
export function ImageSlot({ src, alt = '', placeholder = 'drop image', fit = 'cover' }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }}
        />
      ) : (
        <span
          style={{
            fontFamily: font.mono,
            fontSize: type.caption,
            letterSpacing: '.02em',
            color: color.inkFaint,
          }}
        >
          {placeholder}
        </span>
      )}
    </div>
  )
}
