# KeebSoc site: guide for agents

Next.js (App Router), TypeScript, CSS Modules, MDX content. Deployed on Vercel's free plan.
This file covers how styling is set up and the rules agreed with the site owner. Follow it unless the owner says otherwise.

## Design language

- **Corners:** square by default. Don't add `border-radius` to cards, containers or buttons. Existing radii stay: avatars and round icon buttons (`--radius-full`), tags (`--radius-sm`, 4px), carousel/lightbox photos (`--radius-md`, 6px), code blocks, Vendors cards, and the Keycap/Macropad illustrations. This is a strong default, not an absolute ban: ask before adding a new one.
- **Outlines:** 3px orange (`--default-border`) on cards and panels.
- **Type:** Red Hat Mono (`--font-brand-mono`) for card, post and event titles, section headings, labels, tags and buttons; Red Hat Display (`--font-brand`) for page headings and body text.
- **Hover:** clickable cards and buttons use the press hover (`shared.pressable`): lift up-left by `--press-lift` with a hard `--press-shadow` offset shadow that grows from `0 0 0`, over `--duration-normal` with `--ease-out`. Change its colour with `--press-colour`; don't rewrite the hover.
- **Never use `prefers-reduced-motion`** (media queries or JS checks). The owner wants every animation to play for everyone; they're all subtle. Remove any you find.
- **Page patterns:**
  - Page `<h1>`, then content. No tagline or intro line under a page heading.
  - Sections use `shared.sectionHeading` (mono heading with a 3px rule running right).
  - Index pages feature the newest/next item in a wide card, then a grid of smaller cards.
  - No divider line between a card's image and its text.
  - Empty states are designed panels (see the events "Coming up" empty state), not a lone line of text.

## Links

- External `http(s)` links open in a new tab, everywhere except the /links link cards (which deliberately stay in the same tab; its social icons still open a new tab).
- `Button` does this automatically (`newTab` defaults to true for external URLs). /links renders its cards with plain `next/link`, so they stay in the same tab.
- MDX content (blog posts, event write-ups) uses `MdxLink` (`src/components/MdxLink.tsx`): external links in a new tab, internal links via `next/link` in the same tab.
- Rubric event descriptions are HTML: `sanitizeHtml` in `events/[slug]/page.tsx` adds `target="_blank"` to their links.
- The site has two Discord invites on purpose (analytics): one in `socials` (`src/lib/consts.ts`) and one behind the `/discord` redirect in `next.config.mjs`. Don't merge or change them.

## Dates and times

- Always format through `src/lib/time.ts`: `formatDate` → "Fri, 18 Sept 26"; `formatTime` → "04:00 PM" or "04:00 PM – 07:00 PM" (leading zero, capital AM/PM). `isMultiDayEvent` decides whether to show an end time or a "through"/"until" line.
- Don't add `toLocaleDateString` or ad-hoc `Intl` formatting in pages. (Exception: the decorative date stamp graphic on event images.)
- Don't change time zones. Event dates are stored without a zone and display in the runtime's local zone; date-only strings ("2026-10-24") are formatted in UTC so the day can't shift.

## Images

- Don't use `next/image`: on-demand optimisation costs Vercel function calls on the free plan. Use plain `<img>` (or `CoverImage`, which adds a designed fallback behind the image for slow, missing or broken files).
- Compress files before adding them to `public/`: at most ~2000px on the long side, JPEG ~q82, PNG lossless or high-quality palette. Nothing should be megabytes.
- Card images use a fixed aspect ratio (2:1 on /blog).

## Blog posts (`content/blog/*.mdx`)

- Frontmatter: `title`, `author`, `date` (YYYY-MM-DD), `description`, `slug`, `image` (card + share preview, ideally 1600×840), `tags`, optional `eyebrow` (small label above the title) and `subtitle` (line under it).
- The post page renders the standard header (back link, eyebrow, mono title, subtitle, "By {author} • {date}"). Splash posts set `hideHeader: true` and render `<Splash>` instead (full-bleed hero; it carries its own back link).
- Write plain markdown. Don't create a new component for a one-off look; use a global utility class instead (e.g. `textLavender`, `textMono` in `(default)/globals.css`).
- MDX gotchas:
  - next-mdx-remote v6 strips JS expressions, so `style={{…}}` silently disappears. Use `className="…"` with a global class (CSS Module classes are hashed and won't match).
  - Escape `<` in text as `&lt;` (e.g. `&lt;3`, `o(&gt;ω&lt;)o`); a bare `<` followed by a digit or `)` breaks the build.
  - Multi-line content inside a JSX element gets wrapped in its own `<p>`, so use a `<div>` wrapper, not `<p>` (a `<p>` in a `<p>` is invalid HTML and causes hydration errors). A utility class on that wrapper must also target the inner `p` for font-size, because the global `p` rule sets its own size (see `.textMono, .textMono p`).

## CSS architecture

### Files and load order
Both layouts import, in order: `src/styles/tokens.css` (fonts plus every design token, light values), `src/styles/elements.css` (element defaults shared by all layouts: pre, code, blockquote, table, img, hr), then their own `globals.css`.
- `src/app/(default)/globals.css`: dark-mode token overrides, body/main setup, headings, links, lists, and a few MDX utility classes for the main site.
- `src/app/(links)/globals.css`: the /links page's body, texture and framed `main`. /links has no dark mode. Its data (`links` in `src/lib/consts.ts`) has a `kind` (video / article / discord: picks icon and label) . The link cards and social buttons use brand colours on purpose: Discord `--purple-300`, YouTube `--red-300`, Instagram `--pink-300`, Facebook `--blue-300`, anything else orange. Page order: the next event (`getNextEvent` in `src/lib/events.ts`; a "Check out our events" card linking to /events when nothing is coming up), the link cards, the 3 newest blog posts, then 3 shop items linking to /shop (`getMerchandise` in `src/lib/rubric.ts`). The page revalidates hourly.
- `src/styles/shared.module.css`: shared classes (below). `src/styles/prose.module.css`: long-form reading rhythm.
- Page and component `*.module.css`: only what is unique to that page or component.

### Tokens: use them, don't hard-code
- Colour roles: `--heading`, `--foreground`/`--background`, `--surface` (bordered panels, cards), `--tag-background`/`--tag-text`, `--card-meta` (dates, prices), `--color-description`, `--message-color`, `--color-error`, `--icon-muted`, `--color-rubric(-dark)`, `--text-strong` (emphasised values), `--accent-soft` (soft orange fill: avatars, year-button hover), `--on-accent-soft` (text and marks on that fill), `--accent-wash` (faint orange panel: Callout). Over photos: `--on-photo`, `--on-photo-muted`, `--scrim`, `--scrim-soft(-hover)`, `--glass(-hover)`. Raw palette: `--orange-000…400`, `--gray-*`.
- Dark mode is done with tokens: role tokens are redefined once in the `prefers-color-scheme: dark` block of `(default)/globals.css`. Don't add dark-mode blocks to components; if a component needs a new light/dark colour, add a role token to `tokens.css` plus its dark value in that block.
- Type scale: `--text-xs` 12, `--text-sm` 14, `--text-base` 16, `--text-md` 18, `--text-lg` 20, `--text-xl` 24, `--text-2xl` 32, `--text-3xl` 40, `--text-display` 64 (px). Weights: `--weight-medium` 500, `--weight-semibold` 600 (headings), `--weight-bold` 700 (labels, tags, buttons). Leading: `--leading-tight` 1.2, `--leading-snug` 1.4, `--leading-normal` 1.6, `--leading-relaxed` 1.75. `--tracking-label` 0.06em for uppercase labels. Fonts: `--font-brand` (Red Hat Display), `--font-brand-mono` (Red Hat Mono), `--font-mono` (code only).
- Layout: `--space-2xs…3xl` (0.25–4rem), `--reading-width` 46rem (text column of every long-form page, in rem so different fonts line up), `--radius-sm` 4px / `--radius-md` 6px / `--radius-full`, `--default-border` (3px orange).
- Motion: `--duration-fast` 0.2s (colour/opacity), `--duration-normal` 0.25s (movement), `--duration-slow` 0.3s (chrome), `--ease-out`. Press hover: `--press-lift` 2px, `--press-shadow` 4px.
- Stacking: `--z-below` -1, `--z-raised` 1, `--z-controls` 2, `--z-overlay-content` 10, `--z-sticky` 100, `--z-modal` 1000, `--z-modal-controls` 1001.
- Breakpoints (media queries can't read variables): 420 / 600 / 768 / 1024 / 1400px. Write mobile-first `min-width`; when you need `max-width`, use the breakpoint minus 1 (767px) so ranges never overlap.
- Allowed exceptions: the editorial blog components (Keycap, Keycaps, Splash, Question) keep their own sizes; icon glyph sizes; inline `code` stays at 0.9em so it scales with its text.

### Line height
`body` is 1.6. Anything compact (tags, chips, labels, buttons, navbar, footer, sponsor banner) must set `line-height: var(--leading-tight)`, or it inherits 1.6 and grows. Headings get 1.2 globally. Long-form text gets 1.75 from `.prose`.

### shared.module.css
- `page`: the 1200px page container every top-level page uses.
- `pressable`: the press hover (lift up-left plus a hard offset shadow). Change its colour with `--press-colour`, not by rewriting the hover.
- `button` (outlined) / `buttonPrimary` (filled): every button and link-button. Variants compose these and override colours or custom properties.
- `sectionHeading`: mono heading with the rule running to the right.
- `cardLink` (press hover, block), `cardBody`, `cardTitle`, `cardMeta`, `cardDescription`: card building blocks.
- `tagList` / `tag` (use the `TagList` component for read-only tags), `label` (small uppercase mono), `caption` (image captions), `message` / `errorMessage` (loading, empty and error states).

### prose.module.css
`.prose` holds long-form typography only: line height, paragraph spacing, justified text, and the Q&A answer bar. Blog posts use it on the article; event write-ups compose it (`.eventContent`). `.prose` doesn't set width: each long-form page's article sets `max-width: calc(var(--reading-width) + 2 * var(--space-xl))` (blog post `.prose` layout in blog/page.module.css, `.eventPage article`), so the text column is exactly `--reading-width`. The blog post article's margin and padding must stay as they are, because `Splash` pulls itself up with `calc(-1 * (var(--space-3xl) + var(--space-xl)))`. Don't add element rules to `.prose` (`.prose ul` etc.): at specificity 0,1,1 they beat components' single-class rules. A `.prose :is(ul, ol)` margin once broke the Keycap spec lists.

### composes
- Compose what you need from shared directly, and list every class explicitly: `composes: pressable button buttonPrimary from "@/styles/shared.module.css";`. A local class that composes another local class which composes from shared can lose the shared class.
- Both the `@/` alias and relative paths work under the dev server (Turbopack); `next build` hasn't been checked yet.
- To adjust a composed style, set its custom property (`--press-colour`, `--round-size`) rather than out-specifying it. Doubled selectors (`.x.x`) are a last resort.

### Specificity gotchas
- `.prose p` is 0,1,1, so inside posts a component needs `.component p`, not just `.component`, to restyle its paragraphs.
- Global `h1–h6` set a colour. Text on photos overrides it (HighlightCard, Navbar); prefer a scoped selector over adding more `!important`.
- CSS Modules fail silently: `styles.typo` renders `class="undefined"`. After renaming or removing a class, search the TSX for every `styles.<name>` / `shared.<name>`.

### Button
`<Button linkURL newTab? variant? className?>` renders a `next/link` with `shared.button` (or `shared.buttonPrimary` for `variant="primary"`). External `http(s)` URLs open in a new tab by default. Don't create new button CSS; compose or extend the shared classes.

### Shared components
`TagList` (read-only tags), `Card`, `Button`, `CoverImage` (image with fallback), `MdxLink`. Round icon buttons (`.roundButton` / `.arrow` in `Blog/Lightbox.module.css`; size and colours via `--round-size` / `--round-font` / `--round-bg`) are shared by the Carousel and the Lightbox.

## Working on the site

### Verifying changes
- Run `npx tsc --noEmit -p .`, and check that no `styles.x` read is missing from its module.
- Look at the result, don't assume. The dev server usually runs at http://localhost:3000. Headless Edge works for screenshots on Windows: `"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless --disable-gpu --hide-scrollbars --window-size=1440,2200 --virtual-time-budget=8000 --screenshot="C:/path/out.png" http://localhost:3000/<page>` (forward slashes in the output path). Add `--blink-settings=preferredColorScheme=0` for dark mode and a separate `--user-data-dir` if another process is using Edge. Headless Edge won't lay out narrower than ~500px. For phone widths, drive Chrome over the DevTools protocol with `Emulation.setDeviceMetricsOverride` (width 375, `mobile: true`). This site's `<main>` is the scroll container, so unlock `html, body, main` overflow before a full-page shot.
- Compare before/after at phone, 768, 1280 and 1600 widths, in light and dark. Full-page screenshots resize the viewport, so anything sized in vh/dvh (the blog Splash is `min-height: 100dvh`) changes height with the page; that alone isn't a regression. Lazy images may not load in headless shots.
- Hydration warnings mentioning `<body className="vsc-initialized">` come from a browser extension, not the site.

### Editing files
- Some files use CRLF line endings. Prefer the Edit tool over multi-line sed/Python replacements, which fail to match on CRLF.

### Several sessions at once
More than one Claude session may work on this repo at the same time. Before editing a shared area (tokens, globals, shared/prose modules, Button, a page another session is redesigning), check who's working on it and agree ownership; hand files back explicitly when done. Don't commit unless the owner asks.
