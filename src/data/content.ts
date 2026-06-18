/**
 * All site copy lives here so it can be edited without touching layout.
 * Image fields reference a path under /public — drop a real file there (or a
 * URL) and ImageSlot renders it; omit it and a quiet placeholder shows.
 */

export const identity = {
  name: 'Yunyou Tang',
  alias: 'Pillow Witch',
  tag: 'Neurology · Berlin',
}

export type ProjectEntry = {
  id: string
  title: string
  body: string
  /** Right-aligned status note: a year, a phase, a venue. */
  note: string
}

const ongoing: ProjectEntry[] = [
  {
    id: 'brain-1',
    title: 'Vertigo & the falling self',
    body: 'Vestibular illusions and the strange physics of a body that has lost its sense of down.',
    note: 'in progress',
  },
  {
    id: 'brain-2',
    title: 'Ward rounds',
    body: 'A kept logbook of the neurology wards — small cases, big questions, like a diary.',
    note: 'ongoing',
  },
]

const finished: ProjectEntry[] = [
  {
    id: 'brain-3',
    title: 'EEG garden',
    body: 'Generative blooms grown from the noise floor of brainwave data.',
    note: '2025',
  },
]

export const brain = {
  kicker: 'the skull → what the mind makes',
  title: 'Brain project',
  groups: [
    { id: 'ongoing', label: 'ongoing', entries: ongoing },
    { id: 'finished', label: 'finished', entries: finished },
  ],
}

/**
 * A Playground post = a blog/Instagram hybrid entry. `cover` and `images` are
 * BOTH optional:
 *   - has `cover`  → the masonry shows an image card (Instagram feel)
 *   - no `cover`   → the masonry shows a text card (blog feel)
 * `images` (a multi-frame gallery) is independent of `cover`; a post can be
 * pure text, single image, multi-image, or text with inline images in `body`.
 */
export type PlayImage = {
  src: string
  alt: string
  /** Optional mono caption shown under the image. */
  caption?: string
}

export type PlayPost = {
  id: string
  title: string
  /** ISO-ish date string used for display + sort. */
  date: string
  /** Breadcrumb halves shown in the post header. */
  section: string
  kicker: string
  /** Short line shown on the masonry card under the title. */
  excerpt: string
  /** Long-form markdown-ish body (plain paragraphs, split on blank lines). */
  body: string
  /** Cover image for the masonry card — omit for a pure text post. */
  cover?: PlayImage
  /** Gallery frames for the detail carousel — omit/empty for a text post. */
  images?: PlayImage[]
  /** Masonry weight. `large` reserves more column height. */
  size: 'large' | 'small'
  tags: string[]
}

const playPosts: PlayPost[] = [
  // ── mixed: image + long-ish text ───────────────────────────────────────────
  {
    id: 'play-1',
    title: 'U-Bahn ghosts',
    date: '2025-02-11',
    section: 'the heart',
    kicker: 'what it keeps',
    excerpt: 'Long exposures on the last trains out of Alexanderplatz.',
    body: `Shot on the last trains out of Alexanderplatz — bodies smear into light and the carriage keeps its own time.

I like the platform best in the dead hour after one, when the next train is a rumour and the tiled walls hold a sound that isn't quite an echo. You learn the rhythm of the city by the gaps between its trains.

Three frames from one cold platform, hand-held, shutter dragged until the people became weather.`,
    cover: { src: '/nightlife.jpg', alt: 'Late train, Alexanderplatz' },
    images: [
      { src: '/nightlife.jpg', alt: 'Late train, Alexanderplatz' },
      { src: '/photography.jpg', alt: 'Platform, 1:14am', caption: 'platform · 1:14am' },
      { src: '/event.jpg', alt: 'Doors closing' },
    ],
    size: 'large',
    tags: ['35mm', 'berlin', 'night'],
  },

  // ── pure text: a blog post, no image at all ─────────────────────────────────
  {
    id: 'play-2',
    title: 'On working the night',
    date: '2025-03-03',
    section: 'the heart',
    kicker: 'what it keeps',
    excerpt: 'A short note on the hours nobody photographs.',
    body: `The night shift has a texture you can't explain to anyone who keeps daylight hours. Time goes soft. The ward breathes slower. You become very good at reading a face in the dark.

I used to think the body had one clock. It has many, and they argue. The brain keeps a worse one than you'd hope — which is, I suppose, the whole reason I am here, awake, writing this instead of sleeping.

No photograph for this one. Some hours refuse to be kept that way.`,
    size: 'small',
    tags: ['notes', 'charité'],
  },

  // ── single image, short body ────────────────────────────────────────────────
  {
    id: 'play-3',
    title: 'The cat that visits',
    date: '2025-04-09',
    section: 'the heart',
    kicker: 'what it keeps',
    excerpt: 'No name, no collar, all opinions.',
    body: `Comes to the fire escape around dawn, leaves before I can decide if it's mine. A small recurring miracle with strong opinions about the windowsill.`,
    cover: { src: '/bird.jpg', alt: 'A visiting cat at dawn' },
    images: [{ src: '/bird.jpg', alt: 'A visiting cat at dawn' }],
    size: 'small',
    tags: ['dawn', 'home'],
  },

  // ── mixed: text with an inline image partway through ────────────────────────
  {
    id: 'play-4',
    title: 'First light through an old lens',
    date: '2025-04-22',
    section: 'the heart',
    kicker: 'what it keeps',
    excerpt: 'A roll shot just to learn the camera’s breathing.',
    body: `A roll I shot only to learn the camera's breathing — light leaks and all. Mistakes worth keeping.

![A frame from the test roll](/photography.jpg "first light, with the leak")

The lens is older than I am and slightly drunk about focus. But there's a softness to it that no modern glass will give you — the world remembered rather than recorded.`,
    cover: { src: '/photography.jpg', alt: 'Test roll, first light' },
    images: [
      { src: '/photography.jpg', alt: 'Test roll, first light' },
      { src: '/event.jpg', alt: 'A second frame' },
    ],
    size: 'large',
    tags: ['16mm', 'test'],
  },

  // ── single image, atmospheric ───────────────────────────────────────────────
  {
    id: 'play-5',
    title: 'Spree, 6am',
    date: '2025-05-18',
    section: 'the heart',
    kicker: 'what it keeps',
    excerpt: 'The river before the city wakes.',
    body: `Fog on the water, one rower, the bridges still asleep. The only hour Berlin holds still long enough for a photograph.`,
    cover: { src: '/gourmet.jpg', alt: 'Spree at dawn' },
    images: [
      { src: '/gourmet.jpg', alt: 'Spree at dawn' },
      { src: '/nightlife.jpg', alt: 'Oberbaumbrücke', caption: 'oberbaumbrücke' },
    ],
    size: 'small',
    tags: ['dawn', 'river'],
  },

  // ── pure text: the shortest possible post ───────────────────────────────────
  {
    id: 'play-6',
    title: 'Pressed, between pages',
    date: '2025-06-07',
    section: 'the heart',
    kicker: 'what it keeps',
    excerpt: 'An accidental herbarium of every walk home.',
    body: `Leaves and petals flattened into the back of a notebook — an accidental herbarium of every walk home. One day I'll know all their names.`,
    size: 'small',
    tags: ['notes', 'small things'],
  },
]

export const playground = {
  kicker: 'the heart → what it keeps',
  title: 'Playground',
  posts: playPosts,
}

/** Right-column content for an About section row. Either plain text or links. */
export type AboutSection = {
  id: string
  label: string
  /** Plain value lines (rendered serif). */
  lines?: string[]
  /** Link lines (rendered as hover-underlined anchors). */
  links?: { label: string; href: string }[]
}

export const about = {
  kicker: 'the feet → where they stand',
  title: 'About',
  /** A real, on-brand image (replaces the removed meme). City-at-odd-hours. */
  portrait: { src: '/nightlife.jpg', alt: 'Berlin, photographed at an odd hour' },
  portraitCaption: 'Berlin, an odd hour',
  bio:
    'A neurologist-in-training at Charité, Berlin — and a pillow witch after hours. I keep notebooks full of brains and hearts, photograph the city at odd times, and suspect that anatomy is only another way of drawing a self-portrait.',
  sections: [
    {
      id: 'currently',
      label: 'currently',
      lines: ['Doctoral researcher in neurology', '@ Charité – Universitätsmedizin Berlin'],
    },
    {
      id: 'speaks',
      label: 'speaks',
      lines: ['中文 · English · Deutsch (a little)'],
    },
    {
      id: 'elsewhere',
      label: 'elsewhere',
      links: [{ label: 'instagram → @funckjose', href: 'https://instagram.com/funckjose' }],
    },
    {
      id: 'work',
      label: 'work',
      links: [{ label: 'yunyou.tang@charite.de', href: 'mailto:yunyou.tang@charite.de' }],
    },
    {
      id: 'personal',
      label: 'personal',
      links: [{ label: 'tangyunyoujose@outlook.com', href: 'mailto:tangyunyoujose@outlook.com' }],
    },
  ] as AboutSection[],
}
