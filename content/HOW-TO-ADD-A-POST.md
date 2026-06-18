# How to add a Playground post 📝

You don't need to touch any code. A post is just a text file you write in
**Markdown**, plus your images. Everything else (the cover, the photo gallery,
the card size) is figured out for you automatically.

All your posts live in the folder `content/playground/`.

---

## The 3-step recipe

### 1. Add your images

Put your photos into the **`public/`** folder (one level up from here).
Use simple filenames, no spaces — e.g. `berlin-fog.jpg`.

On GitHub: open the `public` folder → **Add file → Upload files** → drag your
photos in → **Commit changes**.

### 2. Create a new post file

In the `content/playground/` folder, make a new file. Name it like:

```
2025-07-20-my-new-post.md
```

(the date first, then a short name, ending in `.md`).

On GitHub: **Add file → Create new file**, type the name, then paste the
template below.

### 3. Write the post

Copy this template and fill it in:

```markdown
---
title: My new post
date: 2025-07-20
tags: [berlin, film]
---

Write whatever you want here. Leave a blank line between paragraphs.

![](/berlin-fog.jpg)
![](/another-photo.jpg)
```

Then **Commit changes**. The website rebuilds and publishes itself in a minute
or two. That's it. ✨

---

## The only rules you need

- The part between the two `---` lines is the **info card**. You only really
  need `title` and `date`. `tags` is optional.
- **`date`** must look like `YYYY-MM-DD` (year-month-day). Newer dates show up
  first on the wall.
- To add a photo, write `![](/filename.jpg)` on its own line. The `/` means
  "look in the public folder". The first photo in the post becomes the **cover**;
  all the photos together become a **swipe-through gallery**.
- **No photos? No problem.** Leave them out and the post becomes a clean
  text/blog card instead.
- Want a little caption under a photo? Put it in quotes:
  `![](/photo.jpg "shot at dawn")`.

## Common mistakes

- ❌ Forgetting the `/` in front of the image name (`![](berlin.jpg)` won't show
  → use `![](/berlin.jpg)`).
- ❌ A space in the image filename. Rename `my photo.jpg` → `my-photo.jpg`.
- ❌ Uploading the image but typing a different filename in the post. They must
  match exactly, including capital letters.

When in doubt, copy an existing `.md` file from `content/playground/` and change
the words. (Tip: there's a full format spec at `content/AI-FORMAT-SPEC.md` you can
hand to an AI to generate a correctly-formatted post for you.)
