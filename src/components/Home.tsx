import { color, font } from '../styles/theme'
import { GlitchTitle } from './GlitchTitle'
import type { View } from '../types'

type NavItem = {
  view: Exclude<View, 'home'>
  title: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { view: 'brain', title: 'Brain Project', label: 'Open Brain Project' },
  { view: 'play', title: 'Playground', label: 'Open Playground' },
  { view: 'about', title: 'About', label: 'Open About' },
]

type Props = {
  open: boolean
  onOpen: (view: Exclude<View, 'home'>) => void
  /** While the landing intro is up, the home is ghosted behind it. */
  dimmed?: boolean
  /** Re-show the landing intro. */
  onReplayIntro?: () => void
}

export function Home({ open, onOpen, dimmed = false, onReplayIntro }: Props) {
  return (
    <div
      className="home-page"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        backgroundColor: '#050505',
        backgroundImage:
          'radial-gradient(76% 82% at 58% 46%, rgba(31,29,26,.42) 0%, rgba(9,9,9,.72) 58%, #040404 100%), linear-gradient(180deg, rgba(5,5,5,.76), rgba(5,5,5,.9)), url("/intro.jpeg")',
        backgroundSize: '100% 100%, 100% 100%, cover',
        backgroundPosition: 'center, center, center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {onReplayIntro && (
        <button
          type="button"
          onClick={onReplayIntro}
          className="home-intro-link"
          aria-label="Replay intro"
          style={{
            position: 'absolute',
            bottom: 'clamp(22px,4vh,40px)',
            left: 'clamp(26px,6vw,84px)',
            zIndex: 6,
            opacity: open || dimmed ? 0 : 1,
            pointerEvents: open || dimmed ? 'none' : 'auto',
            transition: 'opacity .6s ease .2s',
          }}
        >
          intro
        </button>
      )}

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          background:
            'radial-gradient(110% 100% at 58% 45%, transparent 48%, rgba(8,8,8,.62) 100%)',
        }}
      />

      <div
        className="home-masthead"
        style={{
          position: 'absolute',
          top: 'clamp(54px,8vh,86px)',
          left: 'clamp(26px,6vw,84px)',
          right: 'clamp(26px,6vw,84px)',
          maxWidth: 'min(84vw, 980px)',
          zIndex: 6,
          transform: open
            ? 'translateY(-12px)'
            : dimmed
              ? 'translateY(10px)'
              : 'translateY(0)',
          opacity: open || dimmed ? 0 : 1,
          transition:
            'opacity .7s ease .1s, transform .9s cubic-bezier(.16,1,.3,1) .1s',
          pointerEvents: open || dimmed ? 'none' : 'auto',
        }}
      >
        <GlitchTitle
          style={{
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: 'clamp(44px,8vw,118px)',
            letterSpacing: '-.035em',
            lineHeight: 0.92,
            color: color.ink,
            textShadow: '0 2px 24px rgba(0,0,0,.72)',
          }}
        >
          Yunyou Tang
        </GlitchTitle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '18px 0 0 2px',
            color: color.inkMuted,
          }}
        >
          <span
            style={{
              fontFamily: font.mono,
              fontWeight: 400,
              fontSize: 'clamp(12px,1.25vw,16px)',
              lineHeight: 1.2,
              letterSpacing: '.22em',
              textTransform: 'uppercase',
            }}
          >
            Pillow Witch
          </span>
        </div>
        <div
          style={{
            fontFamily: font.mono,
            fontWeight: 400,
            fontSize: 'clamp(13px,1.35vw,16px)',
            letterSpacing: '.025em',
            lineHeight: 1.72,
            color: color.inkMuted,
            marginTop: 30,
          }}
        >
          Doctoral researcher in neurology
          <div style={{ marginTop: 4 }}>@ Charité - Universitätsmedizin Berlin</div>
        </div>

        <nav className="home-nav" aria-label="Sections">
          {NAV_ITEMS.map((p) => (
            <button
              key={p.view}
              type="button"
              className="home-nav-item"
              onClick={() => onOpen(p.view)}
              aria-label={p.label}
            >
              <span
                className="home-nav-title"
                style={{
                  fontFamily: font.display,
                  fontWeight: 600,
                  lineHeight: 1,
                  color: color.ink,
                }}
              >
                {p.title}
              </span>
              <span
                aria-hidden
                className="home-nav-arrow"
                style={{ color: color.inkFaint, fontFamily: font.code }}
              >
                →
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
