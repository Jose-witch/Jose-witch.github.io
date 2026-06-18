# Pillow Witch — 网站重构规范

给 Claude Code 的说明文档。目标:把现有个人网站(`jose-witch.github.io`，暗黑/解剖隐喻主题，四个页面通过点击骷髅的头/心/脚/手进入)提升为一套统一、克制、refined-brutalist 风格的设计系统，并把 Playground 改造成「blog + Instagram」混合内容流。

整体审美方向:**refined brutalist**(精致的粗野主义)——靠严格网格、极度克制的配色、和清晰的字体分工取得高级感，而不是靠装饰或特效。核心原则是「看起来粗暴，但分毫不差」。

---

## 0. 总体诊断(为什么改)

现状的主要问题:

1. **四个页面不是一套系统。** Brain Project 页用了成熟的「左侧 mono 分区标签 / 右侧内容行」档案布局;About 页退回居中介绍页;首页是左下角大标题;Playground 是散落卡片。四种版式逻辑并存,显得像四个人做的。→ 解决方案见 §4,把 Brain Project 的版式抽成全站模板。

2. **字体三套打架。** 大标题是圆润 funky 的 display 字体,导航是 monospace,正文/引言是衬线。三种调性混在一起。→ 解决方案见 §2,定义三种字体各自只负责一个角色。

3. **配色不够考究。** 纯黑 #000 背景 + 偏亮的「网页红」+ 米白,红色用得太散(标题、导航、状态都在用)。→ 解决方案见 §1,抬高黑、降饱和红、严格限制强调色出现频率。

4. **标题的红色错位描边(chromatic aberration)** 常驻显示,显得像默认故障滤镜,和成熟排版不搭。→ 见 §2.4。

5. **两张「拿枪的 Duolingo」梗图** 出现在 Playground 和 About,会瞬间抵消整体高级感。→ 见 §5.5。

6. **Playground 的内容模型太死。** 现在每个帖子都假设是一组照片(详情页是大图轮播)。用户想要的是文字可多可少、图可有可无的混合流。→ 全部重做,见 §5。

---

## 1. 颜色 (Design Tokens)

定义为 CSS 自定义属性,放在 `:root`。全站只用这些值,不要再出现散落的硬编码颜色。

```css
:root {
  /* 背景 —— 抬离纯黑,避免死黑 */
  --bg:          #161616;   /* 页面主背景 */
  --bg-raised:   #1e1d1b;   /* 卡片/区块的轻微抬升 */
  --bg-sunken:   #111110;   /* 详情页遮罩下沉 */

  /* 文字 —— 暖白 + 两级灰,不要纯白 */
  --ink:         #e8e2d4;   /* 主文字(暖白) */
  --ink-muted:   #9c958a;   /* 次要文字、引言 */
  --ink-faint:   #5f5a52;   /* 标注、编号、占位 */

  /* 强调色 —— 一个降饱和的砖红/暗酒红,省着用 */
  --accent:      #8c2f24;   /* 砖红:仅用于 hover、当前态、分区编号 */
  --accent-dim:  #5c241d;   /* 强调色的暗变体(边框、分隔) */

  /* 线条 */
  --line:        #2e2a26;   /* 默认分隔线/边框,极细 */
  --line-strong: #423c35;   /* hover 或强调边框 */

  --radius:      4px;       /* 全站统一小圆角;brutalist 偏方,别用大圆角 */
}
```

**使用规则(重要):**

- 强调红 `--accent` 是稀缺资源。只允许出现在:链接/卡片的 hover 态、导航里「当前所在页」、分区编号(01 / 02)、面包屑箭头。除此之外一律用 `--ink` / `--ink-muted` / `--ink-faint`。一个屏幕里红色出现的地方越少越显贵。
- 背景不要纯黑。纯黑会让暗色设计显得廉价且对比刺眼;`#161616` 是更高级的「近黑」。
- 文字不要纯白。`#e8e2d4` 这种暖白和暗背景的对比更柔和、更有质感。
- 暗色模式下确保正文对比度 ≥ 4.5:1。`--ink` on `--bg` 满足。`--ink-muted` 仅用于非关键文字。

---

## 2. 字体 (Typography)

三种字体,每种**只负责一个角色**,这是统一感的关键。

### 2.1 角色分工

| 角色 | 用途 | 字体方向 |
|---|---|---|
| **Display** | 大标题(页名)、帖子标题、身份名 | grotesque / 几何无衬线,有个性但克制 |
| **Mono** | 面包屑、导航、日期、状态标签、分区标签、元信息 | 等宽,「系统在标注」的角色 |
| **Serif** | 引言、正文、帖子长文 | 人文衬线,「个人在表达」的角色 |

这套分工本身讲了一个故事,正好呼应神经科学主题:**display = 你这个人 / mono = 机器在标注 / serif = 内心在书写**。

### 2.2 具体字体推荐(全部免费、可自托管或 Google Fonts)

**Display(替换掉现在那个圆润 funky 的字体——这是单笔回报最高的改动):**
- 首选:`PP Neue Montreal`(付费)或其免费近似 `Space Grotesk`
- 更狠的压缩黑体方向(如果想要更强的视觉冲击):`Archivo Black` / `Anton` / `Druk`(付费)
- 推荐组合:标题用 `Space Grotesk` 700,字距收紧 `letter-spacing: -0.02em`

**Mono:**
- `Space Mono` / `JetBrains Mono` / `IBM Plex Mono`
- 推荐 `Space Mono` 400,和 Space Grotesk 同源,搭配自然

**Serif:**
- `Newsreader`(Google Fonts,带 italic,非常适合引言)/ `Source Serif 4` / `Spectral`
- 推荐 `Newsreader`,引言用 italic

> 中文字符(About 页有「中文」、首页可能有中文内容)需要一个中文字体兜底。建议正文中文用思源宋体 `Noto Serif SC`(配 Newsreader),标注中文用思源等宽或系统等宽兜底。在 `font-family` 里把中文字体放在拉丁字体之后做 fallback。

### 2.3 字号阶梯(type scale)

```css
--text-display:  clamp(40px, 6vw, 88px);  /* 页面大标题 */
--text-h2:       28px;   /* 帖子/项目标题 */
--text-body:     16px;   /* 正文 */
--text-small:    13px;   /* 引言、描述 */
--text-mono:     12px;   /* 所有 mono 标注 */
```

字重只用两档:Display 用 500–700,正文 400。**不要用 600/700 做正文加粗**,靠字号和字体本身拉层次。

全站文字一律 **sentence case**(句首大写),不要 Title Case,不要全大写。例外:mono 标注里的分区标签(如 `ONGOING` `FINISHED` `FEB 11, 2025`)可以全大写,因为那是「系统标签」的语感——但保持一致。

### 2.4 移除标题的红色错位描边

Brain Project / Playground 标题现在有红色 chromatic-aberration 偏移描边。两个选择:
- **推荐:直接去掉**,让 display 标题纯净。
- 若想保留这个「神经信号干扰」隐喻:把偏移量减到 ≤1px,且**只在 hover 时出现**,不要常驻。常驻显得像默认滤镜。

---

## 3. 间距与网格

```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 48px;
--space-xl: 96px;
```

- 全站内容最大宽度约 `1080px`,居中,左右留白。
- 内容区采用**严格网格**。brutalist 的高级感来自精确,不是随性。
- 移动端:display 标题用 `clamp()` 自动缩放;两栏布局在窄屏塌成单栏。

---

## 4. 统一页面模板(四页共用)

把 **Brain Project 页的版式**抽成所有四页的骨架。每一页从上到下都是:

```
[面包屑]   the X → ...           ← mono, --accent 色, --text-mono
[大标题]   Page Title            ← display, --ink
[引言]     一句 serif italic 引言  ← serif italic, --ink-muted, max-width ~340px
─────────────────────────────── ← --line 分隔线
[内容区]   左栏 88px: mono 分区标签   右栏 1fr: 内容行
```

内容区统一用两栏 grid:

```css
.page-body {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: var(--space-md);
  border-top: 0.5px solid var(--line);
  padding-top: var(--space-md);
}
.section-label {           /* 左栏:分区标签 */
  font-family: var(--font-mono);
  font-size: var(--text-mono);
  color: var(--accent);
  letter-spacing: 0.05em;
}
.section-label .count { color: var(--ink-faint); }  /* 编号用 faint */
```

### 各页如何套用这个模板:

- **首页(骷髅全身导航)**:这是入口,保留骷髅 + 四个解剖锚点(skull→Brain / heart→Playground / feet→About / 手→?)的概念,这是你最好的创意,别动。只需:左下角大标题换成新 display 字体、配色换成新 token、导航箭头的红只在 hover 时亮。骷髅虚化作为背景锚点保留。

- **Brain Project(skull)**:已经是模板本体,基本不动。只去掉标题红色错位描边(§2.4)。右侧虚化骷髅位置和透明度刚好,保留。分区 `ONGOING 02` / `FINISHED 01` + 项目编号 `01 02` + 右侧状态标签(`in progress` / `ongoing` / `2025`)这套全部保留,它是范本。

- **About(feet)**:**改动最大、回报最高**。从现在的居中介绍页改成模板布局:
  - 顶部:面包屑 `the feet → where they stand` + 标题 `About` + 那段 serif 引言(右栏)。
  - 把 `currently` / `speaks` / `elsewhere` / `work` / `personal` 全部做成左栏的 mono 分区标签,对应内容在右栏,像 Brain Project 的 ONGOING/FINISHED 那样竖排。
  - 现有那段自我描述写得很好(尤其 "anatomy is only another way of drawing a self-portrait"),保留文字,只调版式。
  - **换掉拿枪的 Duolingo 梗图**:换成一张调性统一的真实图(自己拍的城市夜景,呼应 "photograph the city at odd times";或笔记本/解剖手稿局部)。

- **第四个页面(手 → ?)**:截图里没给到,但首页导航暗示骷髅的手也是一个入口。用同一个模板套上即可。

---

## 5. Playground 重做:blog + Instagram 混合流

这是这次改动的核心新增。要让 Playground 同时支持:**纯文字长文、纯图、图文混合**,三种帖子在同一个流里共存。

### 5.1 内容模型(每篇帖子一个内容文件)

因为你用框架(Astro/Next/Nuxt 之类),用「内容集合 + frontmatter」的方式存帖子。Claude Code:按项目实际框架落地(Astro content collections / Next 的 MDX / Nuxt Content 均可)。

每篇帖子文件的 frontmatter 字段:

```yaml
---
title: "U-Bahn Ghosts"
date: 2025-02-11
section: "the heart"          # 面包屑用
kicker: "what it keeps"       # 面包屑后半
images:                       # 可选!没有就是纯文字帖
  - src: /playground/ubahn-1.jpg
    alt: "Late train, Alexanderplatz"
  - src: /playground/ubahn-2.jpg
    alt: "..."
cover: /playground/ubahn-1.jpg  # 可选,列表大格子用;无图帖省略
size: "large"                 # large | small —— 控制在瀑布流里占几格
tags: ["35mm", "berlin", "night"]
---

正文 Markdown。可长可短。可以只有一句话,也可以是一篇 essay。
图片可以穿插在正文里(Instagram 式),也可以完全不放图(blog 式)。
```

关键:`images` 和 `cover` 都是**可选**的。

- 有 `cover` → 列表里渲染成带图大格子(Instagram 感)。
- 无 `cover` → 列表里渲染成纯文字卡片(blog 感):显示标题 + 日期 + 正文摘录的前一两行。

### 5.2 列表布局:混合瀑布流(masonry)

用 CSS columns 或 grid masonry 实现高度不一的瀑布流。规则:

- **有图帖**:`size: large` 的占据更大格子,显示 cover 图 + 标题叠在上面或下面 + 日期(mono)。
- **无图帖**:纯文字卡片,`--bg-raised` 背景,显示 mono 日期 + display 标题 + serif 摘录。
- 所有卡片**对齐到网格,旋转角度 0°**。去掉现在那种随机 tilt 的散落效果——那是拉低质感的主因。
- 想保留一点「随性」?只让**一个**卡片打破网格(刻意地),其余严格对齐。这就是 refined brutalist 的精髓:破例必须看起来是故意的,不是失误。

```css
.playground-grid {
  columns: 3 240px;        /* 响应式瀑布流;窄屏自动减列 */
  column-gap: var(--space-md);
}
.post-card {
  break-inside: avoid;
  margin-bottom: var(--space-md);
  border-radius: var(--radius);
}
.post-card--text {          /* 无图:纯文字卡 */
  background: var(--bg-raised);
  padding: var(--space-sm);
  border: 0.5px solid var(--line);
}
.post-card--image { /* 有图:图 + 标题 */ }
.post-card:hover { border-color: var(--accent); }  /* 强调红只在 hover */
```

### 5.3 详情页(点进某篇帖子)

现在的详情页(截图)是「左大图轮播 + 右元信息」。这个对**多图帖**很好,保留;但要让它对**纯文字帖**也成立:

- **有多张图的帖子**:保留现在的轮播(左图 + `>` 翻页 + 底部圆点),右侧 mono 元信息(`FEB 11, 2025 · 3 FRAMES`)+ display 标题 + serif 正文。背景虚化压暗其他内容做景深——这个效果好,保留。
- **单图帖**:图固定显示,不要轮播控件(无意义的 `>` 和圆点会显得空)。
- **纯文字帖**:不渲染图位,变成一个居中、窄栏(~620px)的阅读视图——display 标题 + mono 日期 + serif 正文,像一篇 blog。这时它就是纯阅读体验。

详情页元信息行的 `· N FRAMES` 只在有图时显示;纯文字帖可换成 `· N min read` 或直接省略。

### 5.4 正文内嵌图(Instagram 式穿插)

正文 Markdown 里允许穿插图片。渲染时:图片占满阅读栏宽度,图下可选 mono 小字 caption(`--ink-faint`)。这样一篇帖子可以是「几段文字 + 一张图 + 又几段文字」的自由混排。

### 5.5 移除梗图

那张拿枪的 Duolingo:
- About 页的那张:**移除**,换真实图(见 §4)。
- Playground 列表里的 "Pressed, Between Pages" 如果就是那张梗图:要么换图,要么——如果你真想保留这个幽默——让它成为 §5.2 里那个「唯一打破网格的彩蛋」,刻意放置,而不是混在里面像失误。

---

## 6. 交互与动效(克制)

- 动效只用在:大标题入场、页面/详情切换、卡片 hover。其余不动。
- 别堆 hover 闪烁那种 demo 式特效——在 Awwwards 上好看,真实站点里显得用力过猛。
- 所有动画只动 `transform` 和 `opacity`,时长 < 300ms(切换)/ < 2s(循环)。
- 用 `@media (prefers-reduced-motion: no-preference)` 包裹动画,默认可关闭。
- 详情页的背景虚化遮罩:保留,这是好效果。

---

## 7. 改动优先级(按「做完最值钱」排序)

1. **About 页对齐到统一模板**(§4)——统一感提升最大,纯搬版式。
2. **移除两张梗图 / 换真实图**(§5.5, §4)——纯换图,立竿见影。
3. **Playground 内容模型 + 混合瀑布流**(§5)——这是新功能核心,工作量最大。
4. **去掉标题红色错位描边**(§2.4)——一行 CSS。
5. **换 display 字体 + 全站配色 token 化**(§1, §2)——基础设施,影响全局但需要细调。
6. **首页骷髅导航换字体/配色**(§4)——保留概念,只换皮。

---

## 8. 务必保留的东西(别改坏)

- 骷髅 + 解剖隐喻的四入口导航(skull/heart/feet/手)——这是整站最好的创意。
- 面包屑 `the X → ...` 的 mono 语感。
- Brain Project 的档案式排版(它是模板范本)。
- 详情页背景虚化做景深的效果。
- About 里那句 "anatomy is only another way of drawing a self-portrait"——文案很好。
- 暗黑 + 暖白 + 一点砖红的整体氛围方向(只是要更克制、更精确)。
