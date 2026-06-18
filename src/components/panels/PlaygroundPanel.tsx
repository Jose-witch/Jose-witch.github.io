import { useState } from 'react'
import { color, font, type } from '../../styles/theme'
import { playground, type PlayPost } from '../../data/content'
import { ImageSlot } from '../ImageSlot'
import { PanelHeader } from '../PanelHeader'
import { PostDetail } from './PostDetail'

export function PlaygroundPanel() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openPost = playground.posts.find((p) => p.id === openId) ?? null

  return (
    <div>
      <PanelHeader kicker={playground.kicker} title={playground.title} lede={playground.lede} />

      {/* A free-floating photo wall — cards scattered by their own x/y/rotate
          rather than a tidy grid. On narrow screens .play-wall flips to a
          single readable column (see global.css). */}
      <div className="play-wall">
        {playground.posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} onOpen={() => setOpenId(post.id)} />
        ))}
      </div>

      {openPost && <PostDetail post={openPost} onClose={() => setOpenId(null)} />}
    </div>
  )
}

type CardProps = {
  post: PlayPost
  index: number
  onOpen: () => void
}

function PostCard({ post, index, onOpen }: CardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="play-card reveal"
      aria-label={`Open post: ${post.title}`}
      style={{
        // free placement on the wall; the parent is position:relative and tall
        left: `${post.x}%`,
        top: `${post.y}%`,
        width: `${post.w}%`,
        ['--rot' as string]: `${post.rotate}deg`,
        ['--i' as string]: index + 3,
      }}
    >
      <div className="play-card-float">
       <div className="play-card-inner">
        <div
          className="img-slot"
          style={{
            position: 'relative',
            aspectRatio: post.aspect,
            background: post.frames[0].image ? color.bgSlot : 'rgba(236,228,206,.06)',
            border: post.frames[0].image
              ? `1px solid rgba(236,228,206,.26)`
              : `1px dashed rgba(236,228,206,.28)`,
          }}
        >
          <ImageSlot
            src={post.frames[0].image}
            placeholder={post.frames[0].placeholder}
            alt={post.title}
          />
          {/* a small stacked-frames hint when the post holds more than one photo */}
          {post.frames.length > 1 && (
            <span className="play-stack" aria-hidden>
              ▦ {post.frames.length}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 10,
            marginTop: 11,
          }}
        >
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: type.h3,
              lineHeight: 1.04,
              color: color.ink,
              textAlign: 'left',
            }}
          >
            {post.title}
          </span>
          <span
            style={{
              fontFamily: font.code,
              fontSize: type.micro,
              letterSpacing: '.03em',
              color: color.inkFaint,
              whiteSpace: 'nowrap',
            }}
          >
            {post.date}
          </span>
        </div>
       </div>
      </div>
    </button>
  )
}
