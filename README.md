# Yunyou Tang — personal site

A single-page personal site built with **React + Vite + TypeScript**, ported from a
Claude-designed comp. An anatomical skeleton sits at center; three pulsing light
points open frosted-glass panels:

- **skull → Brain Project** — research / wards / neuroscience notes
- **heart → Playground** — photographs and small things
- **feet → About** — bio + contact

The look is a warm, dark riso print: cream ink on near-black, an off-register
red/blue CMYK title effect, halftone + film-grain textures, and three typefaces
(Old Standard TT, Space Mono, Caveat, loaded from Google Fonts).

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview  # serve the built site
```

## Where things live

- `src/data/content.ts` — **all copy and image slots**. Edit here, not in the layout.
- `src/styles/theme.ts` — colors, fonts, the CMYK-misregister helper.
- `src/components/` — `Home` (skeleton + light points), `Panel` (glass modal),
  `panels/*` (the three sections), `GlitchTitle`, `Textures`, `ImageSlot`.

### Adding real images

Drop a file in `src/assets/`, import it, and set it on the relevant entry in
`content.ts`:

```ts
import wardRounds from '../assets/ward-rounds.jpg'
// ...in brain.cards:
{ id: 'brain-2', image: wardRounds, /* ... */ }
```

`ImageSlot` shows the image when `image` is set, and a placeholder label otherwise.

### The skeleton

The hero figure is `src/assets/image2.png` — a complete, symmetric skeleton with
**both hands** and a **transparent background**, so it blends seamlessly onto the
dark page (no black box). It replaced the original bundle's `skeleton.png`, which
was missing a hand and had an opaque backdrop. The three light-point anchors are
percentages over this image's box in [src/components/Home.tsx](src/components/Home.tsx);
if you swap the image, re-check those.

---

The original design export (`Yunyou Tang.html`) is git-ignored.
