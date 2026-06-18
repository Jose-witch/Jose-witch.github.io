import { color, font, type } from '../styles/theme'

type Props = {
  src?: string
  alt?: string
  placeholder?: string
}

/**
 * A bordered slot that shows a `src` image (object-fit: cover) when provided,
 * or a dashed-feel placeholder label otherwise. Fills its positioned parent.
 */
export function ImageSlot({ src, alt = '', placeholder = 'drop image' }: Props) {
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
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
