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
  kicker: 'the skull — what the mind makes',
  title: 'Brain Project',
  lede:
    'Field notes from the edge of the nervous system — research, the wards, and the science of losing one’s balance.',
  groups: [
    { id: 'ongoing', label: 'Ongoing', entries: ongoing },
    { id: 'finished', label: 'Finished', entries: finished },
  ],
}

export type PlayItem = {
  id: string
  caption: string
  aspect: string
  rotate: number
  image?: string
  placeholder: string
}

const playItems: PlayItem[] = [
  { id: 'play-1', caption: 'u‑bahn ghosts, feb', aspect: '4 / 5', rotate: -1.4, placeholder: 'drop a photo' },
  { id: 'play-2', caption: 'kitchen still life', aspect: '1 / 1', rotate: 1.2, placeholder: 'drop a photo' },
  { id: 'play-3', caption: 'the cat that visits', aspect: '3 / 4', rotate: -0.7, placeholder: 'drop a photo' },
  { id: 'play-4', caption: '16mm test roll', aspect: '5 / 4', rotate: 1.6, placeholder: 'drop a photo' },
  { id: 'play-5', caption: 'spree, 6am', aspect: '4 / 5', rotate: -1.2, placeholder: 'drop a photo' },
  { id: 'play-6', caption: 'pressed, between pages', aspect: '1 / 1', rotate: 0.9, placeholder: 'drop a photo' },
]

export const playground = {
  kicker: 'the heart — what it keeps',
  title: 'Playground',
  lede:
    'The heart’s own archive — photographs, film stills, and small living things, made between night shifts.',
  items: playItems,
}

export const about = {
  kicker: 'the feet — where they stand',
  title: 'About',
  portrait: { id: 'about-portrait', placeholder: 'drop a portrait' },
  bio:
    'A neurologist‑in‑training at Charité, Berlin — and a pillow witch after hours. I keep notebooks full of brains and hearts, photograph the city at odd times, and suspect that anatomy is only another way of drawing a self‑portrait.',
  facts: [
    { label: 'currently', value: 'Berlin · night shifts' },
    { label: 'speaks', value: '中文 · English · Deutsch (a little)' },
    { label: 'elsewhere', value: 'instagram — @your_handle' },
  ],
  doors: [
    { kicker: 'work', email: 'yunyou.tang@charite.de' },
    { kicker: 'personal', email: 'tangyunyoujose@outlook.com' },
  ],
}
