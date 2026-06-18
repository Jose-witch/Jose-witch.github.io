/**
 * All site copy lives here so it can be edited without touching layout.
 * Image fields reference a path under /public — drop a real file there (or a
 * URL) and ImageSlot renders it; omit it and a quiet placeholder shows.
 */

import { playgroundPosts } from './loadPlayground'

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
    id: 'pscni-signatures',
    title:
      'Absence of Lesion, Network, and Neurotransmitter-Specific Signatures in Post-Stroke Cognitive Impairment: Evidence from Two Independent Cohorts',
    body: '',
    note: 'ongoing',
  },
  {
    id: 'gait-stimulation',
    title:
      'Investigating brain network interactions across behavioral domains to guide therapeutic stimulation for gait',
    body: '',
    note: 'ongoing',
  },
]

const finished: ProjectEntry[] = [
  {
    id: 'who-falls-after-stroke',
    title: 'Who Falls After Stroke? Evidence From a Prospective Stroke Cohort',
    body: '',
    note: 'European Journal of Neurology',
  },
  {
    id: 'dizziness-vertigo',
    title:
      'Neuroanatomical Correlates of Stroke-Related Dizziness and Vertigo: Secondary Analysis from the INSPiRE-TMS Trial',
    body: '',
    note: 'published',
  },
  {
    id: 'neonatal-white-matter',
    title:
      'Sex Differences in Neonatal White Matter Microstructure and Interhemispheric Lateralization: A Diffusion Tensor Imaging Study',
    body: '',
    note: 'published',
  },
  {
    id: 'qc-pipelines-dwi',
    title:
      'Comparative Analysis of Quality Control Pipelines for Diffusion Weighted Imaging Data in a Pediatric Population: A Study of QSIPrep and dMRIPrep Pipelines',
    body: '',
    note: 'published',
  },
  {
    id: 'anxiety-transgender-youth',
    title:
      'Anxiety levels and structural brain connectivity in early pubertal transgender and cisgender youth',
    body: '',
    note: 'published',
  },
]

export const brain = {
  title: 'Work',
  intro: [
    'I study clinical outcomes in post-stroke patients, focusing on motor, mood, and cognitive domains. Through lesion analysis, including structural, functional, and neurotransmitter network connectivity, I sincerely hope to untangle some of the mysteries that remain. This path began in Zurich, where a call to gender neurosciences led me into the forest of neuroimaging. As a queer person myself, I have been, am, and will remain passionate about unraveling the myths of gender in the brain.',
    'Can we, someday, use our sensational minds and pictorial pens to paint the human brain in a poetic way?',
  ],
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

// Posts are authored as Markdown in /content/playground/*.md and loaded via
// loadPlayground.ts — cover/gallery/size are auto-inferred from the file so the
// owner only writes `title`, `date`, and the body.
export const playground = {
  title: 'Playground',
  posts: playgroundPosts,
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
  title: 'About',
  portrait: { src: '/portrait.jpg', alt: 'Portrait' },
  portraitCaption: '',
  /** Free-verse intro — rendered line by line, blank string = paragraph break. */
  bio: [
    'Ｔａｎｚ　ｄｉｒ　ｍｅｉｎｅ　Ａｎｔｗｏｒｔ　ｖｏｒ!',
    '',
    '┗(＊`Д´＊)┛ ♪♫彡 (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ヽ(•‿•)ノ',
    '',
    'See you, see you, on the dancefloor;',
    'See you, see you, in the forest;',
    'See you, see you, in any land that connect us.',
    '',
    '我们会在雨中安全地相见',
    '',
    'If you miss me,',
    'Wenn du mein Fehlen spürst，',
    '如果你想起我，',
    '',
    'I am h-e-r-e-----',
  ],
  sections: [
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
