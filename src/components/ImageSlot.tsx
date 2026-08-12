import { useState } from 'react'
import { fileName } from '../data/media'
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
  // If the photo can't be found, say which filename is missing instead of
  // showing a broken-image icon — that's the one thing worth fixing in the post.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const missing = !!src && failedSrc === src
  const label = missing ? `photo not found: ${fileName(src)}` : placeholder

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
      {src && !missing ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src)}
          style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }}
        />
      ) : (
        <span
          style={{
            fontFamily: font.mono,
            fontSize: type.caption,
            letterSpacing: '.02em',
            color: color.inkFaint,
            padding: '0 14px',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
