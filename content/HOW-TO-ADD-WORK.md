# How to edit the Work section 🧠

You don't need to touch any code. The whole **Work** page — the intro text and
every project under *ongoing* / *finished* — lives in **one single file**:

```
content/work.md
```

To add, remove, or edit a project, you just edit that one file on GitHub and
**Commit changes**. The website rebuilds and publishes itself in a minute or two.

---

## What the file looks like

```markdown
---
title: Work
intro:
  - First paragraph of the intro text goes here.
  - A second paragraph. Add as many "- " lines as you like.
---

## ongoing

- My first ongoing project | ongoing
- Another ongoing project | ongoing

## finished

- A published paper title | European Journal of Neurology
- A paper with no note
- A paper with a link to read it |  | https://doi.org/10.1234/example
```

Two parts:

1. **The top part** (between the two `---` lines) is the intro. `title` is just
   the word **Work**. Under `intro:`, each `- ` line is one paragraph.
2. **The bottom part** is your project lists. Each `## heading` becomes a group
   label (e.g. `ongoing`, `finished`), and every `- ` line under it is one
   project.

---

## Adding a project

Add a new `- ` line under the right `## heading`. The format is:

```
- Project title | note | link
```

The **title is required**. Everything after it is **optional**, separated by a
vertical bar `|`:

| You write | What shows up |
|---|---|
| `- My project` | Just the title |
| `- My project \| 2026` | Title + a small right-side note (a year, a journal, a phase…) |
| `- My project \| ongoing` | Title + the note "ongoing" |
| `- My project \|  \| https://...` | Title + a **read paper ↗** link. (Note the empty space between the two bars = no note.) |
| `- My project \| Nature \| https://...` | Title + note + the **read paper ↗** link |

> When you add a link, a small underlined **read paper ↗** appears under the
> project title. Clicking it opens the paper / URL in a new tab. Use it to link
> to a published paper, a DOI, a preprint, a PDF — anything with a web address.

### Examples

```
- Who Falls After Stroke? Evidence From a Prospective Stroke Cohort | European Journal of Neurology | https://doi.org/10.1111/ene.12345
- A brand new project I just started | ongoing
- A paper that's just listed, no link, no note
```

---

## The only rules you need

- One project = **one line** starting with `- `.
- Use the bar `|` to add a note and/or a link. Order is always
  **title | note | link**.
- To skip the note but still add a link, leave the middle empty:
  `- Title |  | https://...` (a space between the two bars).
- A link must be a full web address starting with `http` (e.g.
  `https://doi.org/...`).
- To **remove** a project, delete its line. To **reorder**, move the lines up or
  down. To **rename a group**, change the `## heading` text.

## How to do it on GitHub

1. Open `content/work.md`.
2. Click the **✏️ pencil** (Edit) button at the top right.
3. Make your changes.
4. Scroll down and click **Commit changes**.

That's it. ✨ When in doubt, copy an existing line and change the words.
