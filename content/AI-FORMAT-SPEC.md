# Playground 文章格式规格 (AI 生成用) / Post Format Spec for AI

> **怎么用这份文档 / How to use this doc**
>
> 把**这一整份文档**连同你想发的内容（草稿文字 + 图片文件名）一起复制给 AI（ChatGPT / Claude 等），并说一句：
>
> > "请根据这份格式规格，把下面的内容生成成一个 Playground 的 .md 文件。"
>
> AI 会输出一个格式正确的 `.md` 文件内容，你只要复制粘贴到 `content/playground/` 文件夹里一个新文件即可。
>
> Copy **this whole document** plus your draft (text + image filenames) to an AI
> and say: *"Using this spec, turn the content below into a Playground .md file."*
> Then paste the AI's output into a new file under `content/playground/`.

---

## 1. 文件名 / Filename

格式：`YYYY-MM-DD-short-slug.md`

- 以日期开头（年-月-日），后接一个简短的英文/拼音短名，全部小写、用连字符 `-` 连接、以 `.md` 结尾。
- 例 / e.g.: `2025-07-20-summer-in-berlin.md`

## 2. 文件结构 / File structure

一个文件 = **Frontmatter（信息头）** + **Body（正文）**，中间用 `---` 分隔。

```markdown
---
title: <文章标题 / Post title>
date: <YYYY-MM-DD>
tags: [tag1, tag2]
---

<正文，Markdown 格式 / Body in Markdown>
```

## 3. Frontmatter 字段 / Frontmatter fields

写在最上面、被两行 `---` 包住的部分。

| 字段 Field | 必填 Required | 说明 Description |
|---|---|---|
| `title` | ✅ 是 Yes | 文章标题，一行纯文本。Plain one-line title. |
| `date`  | ✅ 是 Yes | 发布日期，必须是 `YYYY-MM-DD`。控制排序（新→旧）和显示。 |
| `tags`  | ⬜ 否 No  | 标签列表，写成 `[a, b, c]`。可省略或留空 `[]`。 |

> ⚠️ 不要写 `cover:`、`images:`、`size:`、`excerpt:` 这些字段——它们都是**自动**从正文推断的，写了也会被忽略。
> Do NOT add `cover:`, `images:`, `size:`, `excerpt:` — these are auto-inferred from the body.

## 4. 正文 / Body

`---` 之后的全部内容就是正文，用 **Markdown** 写：

- **段落 Paragraphs**：段落之间空一行。Separate paragraphs with a blank line.
- **图片 Images**：单独一行写 `![描述](/文件名.jpg)`。
  - 路径以 `/` 开头，对应 `public/` 文件夹里的图片。Path starts with `/`, pointing into `public/`.
  - 文件名必须和上传到 `public/` 的图片**完全一致**（含大小写）。Must match the uploaded filename exactly.
  - 可选标题：`![描述](/文件名.jpg "图片说明")` —— 引号里的文字会显示在图片下方。
  - 文件名**不能有空格**。No spaces in filenames (`my-photo.jpg`, not `my photo.jpg`).
- 其它 Markdown（**加粗**、*斜体*、`> 引用`）也支持。

## 5. 自动行为（AI 不用管，但要知道）/ Auto behaviour

生成 md 时**不需要**手动设置这些，系统会自动处理：

- **封面 Cover** = 正文里出现的**第一张**图片。First image in body = the masonry cover.
- **相册 Gallery** = 正文里的**所有**图片，自动组成详情页的左右滑动相册。All body images become the carousel.
- **卡片大小 Card size** = 有图 → 大卡（图片卡）；无图 → 文字 blog 卡。Auto from image presence.
- **摘要 Excerpt** = 自动取正文第一段文字。Auto from the first paragraph.

所以：**想发几张图，就在正文里 `![]()` 插几张；不想配图，就别插图**，其余都是自动的。

---

## 6. 示例 / Examples

### 示例 A：图文相册帖（多图）/ Photo post with a gallery

```markdown
---
title: U-Bahn ghosts
date: 2025-02-11
tags: [35mm, berlin, night]
---

Shot on the last trains out of Alexanderplatz — bodies smear into light.

![Late train, Alexanderplatz](/nightlife.jpg)

I like the platform best in the dead hour after one.

![Platform, 1:14am](/photography.jpg "platform · 1:14am")

![Doors closing](/event.jpg)
```

→ 结果：封面 = `nightlife.jpg`，详情页是 3 张图的滑动相册，大卡片。

### 示例 B：纯文字帖（无图）/ Text-only blog post

```markdown
---
title: On working the night
date: 2025-03-03
tags: [notes]
---

The night shift has a texture you can't explain to anyone who keeps daylight hours.

I used to think the body had one clock. It has many, and they argue.
```

→ 结果：一张安静的文字卡片，点开是居中的阅读栏。

### 示例 C：单图短帖 / One image, short note

```markdown
---
title: The cat that visits
date: 2025-04-09
tags: [dawn, home]
---

Comes to the fire escape around dawn, leaves before I can decide if it's mine.

![A visiting cat at dawn](/bird.jpg)
```

---

## 7. 给 AI 的输出要求 / Output requirements for the AI

当被要求生成 md 文件时，AI 应当：

1. 只输出**一个**完整的 `.md` 文件内容（含 frontmatter + 正文），不要额外解释。
2. Frontmatter 只包含 `title`、`date`、（可选）`tags`；**绝不**添加 `cover/images/size/excerpt`。
3. `date` 一律格式化为 `YYYY-MM-DD`。若用户没给日期，使用今天的日期。
4. 把用户提到的每个图片文件名，按出现顺序写成单独一行的 `![描述](/文件名.jpg)`，并在路径前补上 `/`。
5. 同时**建议一个文件名**，格式为 `YYYY-MM-DD-slug.md`（slug 来自标题）。
6. 用户用什么语言写正文，就保留什么语言，不要翻译正文。

> Output exactly one complete `.md` file (frontmatter + body), no extra prose.
> Frontmatter = `title`, `date`, optional `tags` only — never add cover/images/
> size/excerpt. Format `date` as `YYYY-MM-DD` (use today if unspecified). Turn each
> mentioned image into its own `![desc](/file.jpg)` line in order, prefixing `/`.
> Also suggest a filename `YYYY-MM-DD-slug.md`. Keep the body in the user's language.
