import { useState } from 'react'
import { color } from '../../styles/theme'
import { playground, type PlayPost } from '../../data/content'
import { ImageSlot } from '../ImageSlot'
import { PanelHeader } from '../PanelHeader'
import { PostDetail } from './PostDetail'

/** "2025-02-11" → "FEB 11, 2025" (mono, uppercased). */
export function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  const m = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  return `${m} ${d.getDate()}, ${d.getFullYear()}`
}

export function PlaygroundPanel() {
  const [openId, setOpenId] = useState<string | null>(null)
  const openPost = playground.posts.find((p) => p.id === openId) ?? null

  // newest first
  const posts = [...playground.posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <PanelHeader kicker={playground.kicker} title={playground.title} />

      {/* A refined masonry: heights vary, but every card is on the grid at 0°.
          Image posts get a cover; text posts become a quiet text card. */}
      <div className="playground-grid">
        {posts.map((post, i) => (
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
  const frames = post.images ?? []
  const hasCover = Boolean(post.cover)

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`post-card reveal ${hasCover ? 'post-card--image' : 'post-card--text'}`}
      aria-label={`Open post: ${post.title}`}
      style={{ ['--i' as string]: index + 3 }}
    >
      {hasCover ? (
        <>
          <div
            className="img-slot post-card-cover"
            style={{
              position: 'relative',
              aspectRatio: post.size === 'large' ? '4 / 5' : '1 / 1',
              background: color.bgRaised,
              border: `0.5px solid ${color.line}`,
            }}
          >
            <ImageSlot src={post.cover!.src} placeholder="drop image" alt={post.cover!.alt} />
            {frames.length > 1 && (
              <span className="play-stack" aria-hidden>
                {frames.length}
              </span>
            )}
          </div>

          <div className="post-card-meta">
            <span className="post-card-title">{post.title}</span>
            <span className="post-card-date">{fmtDate(post.date)}</span>
          </div>
        </>
      ) : (
        <div className="post-card-text-body">
          <span className="post-card-date post-card-date--top">{fmtDate(post.date)}</span>
          <span className="post-card-title post-card-title--text">{post.title}</span>
          <p className="post-card-excerpt">{firstLines(post.body)}</p>
        </div>
      )}
    </button>
  )
}

/** A short serif excerpt for text cards — the first paragraph, trimmed. */
function firstLines(body: string): string {
  const first = body.split(/\n\s*\n/)[0].replace(/!\[.*?\]\(.*?\)/g, '').trim()
  return first.length > 140 ? first.slice(0, 140).trimEnd() + '…' : first
}
