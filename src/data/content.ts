/**
 * All site copy lives here so it can be edited without touching layout.
 * Image slots reference an `image` field — drop a real import there (or a
 * URL string) and ImageSlot will render it instead of the placeholder.
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
    title: 'Vertigo & the Falling Self',
    body: 'Vestibular illusions and the strange physics of a body that has lost its sense of down.',
    note: 'in progress',
  },
  {
    id: 'brain-2',
    title: 'Ward Rounds',
    body: 'A kept logbook of the neurology wards — small cases, big questions, like a diary.',
    note: 'ongoing',
  },
]

const finished: ProjectEntry[] = [
  {
    id: 'brain-3',
    title: 'EEG Garden',
    body: 'Generative blooms grown from the noise floor of brainwave data.',
    note: '2025',
  },
]

export const brain = {
  kicker: 'the skull → what the mind makes',
  title: 'Brain Project',
  lede:
    'Field notes from the edge of the nervous system — research, the wards, and the science of losing one’s balance.',
  groups: [
    { id: 'ongoing', label: 'Ongoing', entries: ongoing },
    { id: 'finished', label: 'Finished', entries: finished },
  ],
}

/** A single frame inside a post — one photo (or film still) with an optional
 *  per-image caption. The first frame doubles as the post's cover. */
export type PlayFrame = {
  id: string
  aspect: string
  image?: string
  /** Placeholder label shown until a real image is dropped in. */
  placeholder: string
  /** Optional line shown under the frame in the opened post. */
  note?: string
}

/** A post = an Instagram-style entry: a cover, a title, a date, a short body,
 *  and a small set of frames you page through once it's opened. */
export type PlayPost = {
  id: string
  title: string
  /** A line shown on the floating card, under the title. */
  caption: string
  /** Right-aligned meta on the card + in the post header. */
  date: string
  /** The longer text shown only when the post is opened. */
  body: string
  /** Cover aspect ratio for the floating card. */
  aspect: string
  /** Resting tilt of the floating card, in degrees. */
  rotate: number
  /** Free-floating placement on the wall, as % of the wall box. */
  x: number
  y: number
  /** Relative card width on the wall, as % of the wall box width. */
  w: number
  frames: PlayFrame[]
}

const playPosts: PlayPost[] = [
  {
    id: 'play-1',
    title: 'U‑Bahn Ghosts',
    caption: 'long exposures on the night line',
    date: 'Feb 11, 2025',
    body: 'Shot on the last trains out of Alexanderplatz — bodies smear into light, the carriage keeps its own time. Three frames from one cold platform.',
    aspect: '3 / 2',
    rotate: -2.2,
    x: 2,
    y: 0,
    w: 30,
    frames: [
      { id: 'play-1-a', aspect: '3 / 2', image: '/nightlife.jpg', placeholder: 'drop a photo' },
      { id: 'play-1-b', aspect: '16 / 9', image: '/photography.jpg', placeholder: 'drop a photo', note: 'platform, 1:14am' },
      { id: 'play-1-c', aspect: '3 / 2', image: '/event.jpg', placeholder: 'drop a photo' },
    ],
  },
  {
    id: 'play-2',
    title: 'Kitchen Still Life',
    caption: 'what’s left after the shift',
    date: 'Mar 03, 2025',
    body: 'A bowl, a knife, the blue hour through the window. The quiet inventory of a flat that mostly sees me asleep.',
    aspect: '3 / 2',
    rotate: 1.6,
    x: 38,
    y: 7,
    w: 27,
    frames: [
      { id: 'play-2-a', aspect: '3 / 2', image: '/gourmet.jpg', placeholder: 'drop a photo' },
      { id: 'play-2-b', aspect: '4 / 3', image: '/soccer.jpg', placeholder: 'drop a photo' },
    ],
  },
  {
    id: 'play-3',
    title: 'The Cat That Visits',
    caption: 'no name, no collar, all opinions',
    date: 'Apr 09, 2025',
    body: 'Comes to the fire escape around dawn, leaves before I can decide if it’s mine. A small recurring miracle.',
    aspect: '1 / 1',
    rotate: -1.1,
    x: 70,
    y: 2,
    w: 26,
    frames: [
      { id: 'play-3-a', aspect: '1 / 1', image: '/bird.jpg', placeholder: 'drop a photo' },
      { id: 'play-3-b', aspect: '1 / 1', image: '/duo.jpg', placeholder: 'drop a photo' },
    ],
  },
  {
    id: 'play-4',
    title: '16mm Test Roll',
    caption: 'first light through an old lens',
    date: 'Apr 22, 2025',
    body: 'A roll I shot just to learn the camera’s breathing — light leaks and all. Mistakes worth keeping.',
    aspect: '16 / 9',
    rotate: 2.4,
    x: 8,
    y: 46,
    w: 33,
    frames: [
      { id: 'play-4-a', aspect: '16 / 9', image: '/photography.jpg', placeholder: 'drop a photo' },
      { id: 'play-4-b', aspect: '3 / 2', image: '/event.jpg', placeholder: 'drop a photo' },
    ],
  },
  {
    id: 'play-5',
    title: 'Spree, 6am',
    caption: 'the river before the city wakes',
    date: 'May 18, 2025',
    body: 'Fog on the water, one rower, the bridges still asleep. The only hour Berlin holds still for a photograph.',
    aspect: '3 / 2',
    rotate: -2.6,
    x: 46,
    y: 42,
    w: 28,
    frames: [
      { id: 'play-5-a', aspect: '3 / 2', image: '/nightlife.jpg', placeholder: 'drop a photo' },
      { id: 'play-5-b', aspect: '16 / 9', image: '/photography.jpg', placeholder: 'drop a photo', note: 'oberbaumbrücke' },
    ],
  },
  {
    id: 'play-6',
    title: 'Pressed, Between Pages',
    caption: 'small living things, kept',
    date: 'Jun 07, 2025',
    body: 'Leaves and petals flattened into the back of a notebook — an accidental herbarium of every walk home.',
    aspect: '1 / 1',
    rotate: 1.2,
    x: 76,
    y: 50,
    w: 24,
    frames: [
      { id: 'play-6-a', aspect: '1 / 1', image: '/duo.jpg', placeholder: 'drop a photo' },
      { id: 'play-6-b', aspect: '1 / 1', image: '/bird.jpg', placeholder: 'drop a photo' },
      { id: 'play-6-c', aspect: '4 / 3', image: '/soccer.jpg', placeholder: 'drop a photo' },
    ],
  },
]

export const playground = {
  kicker: 'the heart → what it keeps',
  title: 'Playground',
  lede:
    'The heart’s own archive — photographs, film stills, and small living things, made between night shifts.',
  posts: playPosts,
}

export const about = {
  kicker: 'the feet → where they stand',
  title: 'About',
  portrait: { id: 'about-portrait', image: '/duo.jpg', placeholder: 'drop a portrait' },
  bio:
    'A neurologist‑in‑training at Charité, Berlin — and a pillow witch after hours. I keep notebooks full of brains and hearts, photograph the city at odd times, and suspect that anatomy is only another way of drawing a self‑portrait.',
  facts: [
    { label: 'currently', value: 'Berlin · night shifts' },
    { label: 'speaks', value: '中文 · English · Deutsch (a little)' },
    { label: 'elsewhere', value: 'instagram → @funckjose' },
  ],
  doors: [
    { kicker: 'work', email: 'yunyou.tang@charite.de' },
    { kicker: 'personal', email: 'tangyunyoujose@outlook.com' },
  ],
}
