# Design System Catalog — `admin-dashboard/` (DEEP DIVE)

> **How to use this file.** Before creating or editing ANY page: (1) find the closest page in §7 and clone its ASCII structure + idioms, (2) pick primitives only from §3 (APIs verified), charts only from §4, (3) obey tokens in §2. If it doesn't look like these pages, it's wrong. `ui-context.md` is the law (short rules); THIS file is the map (every detail). Researched 2026-09-06 by 8 parallel agents reading every `route.tsx`, every `-components/` file, and every primitive wrapper. No guessing below — file paths are cited.

## 1. App shells

### 1a. Dashboard shell (`routes/(main)/dashboard/route.tsx`) — ALL MVP routes live here

```
┌────────────────────────────────────────────────────────────────────────────┐
│ SidebarProvider  --sidebar-width:calc(var(--spacing)*68)                   │
│ ┌────────────────────────┐ ┌─────────────────────────────────────────────┐ │
│ │ AppSidebar             │ │ SidebarInset                                │ │
│ │ variant/collapsible    │ │ [centered: *>mx-auto max-w-screen-2xl]      │ │
│ │ from cookie loader     │ │ ┌─────────────────────────────────────────┐ │ │
│ │ HEADER: [Command icon] │ │ │ HEADER h-12 border-b px-4 lg:px-6       │ │ │
│ │ APP_CONFIG.name        │ │ │ [≡][|][⌕ Search ⌘J]  [⚙][☀][gh][👤]    │ │ │
│ │ [＋ Quick Create] [✉]  │ │ └─────────────────────────────────────────┘ │ │
│ │ {NavGroups}            │ │ ┌─────────────────────────────────────────┐ │ │
│ │  label + links /       │ │ │ CONTENT p-4 md:p-6 (or p-0 when         │ │ │
│ │  collapsibles + badges │ │ │ data-content-padding="false")           │ │ │
│ │ FOOTER: [SupportCard]  │ │ │ <Outlet/>                               │ │ │
│ │ [NavUser]              │ │ └─────────────────────────────────────────┘ │ │
│ └────────────────────────┘ └─────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

**Sidebar regions** (`-components/sidebar/`):
- `app-sidebar.tsx`: `SidebarHeader` = Link `/dashboard/default` + `Command` icon + `APP_CONFIG.name` (`font-semibold text-base`).
- `nav-main.tsx`: **Quick Create block** (`SidebarMenuButton bg-primary text-primary-foreground` + PlusCircle + adjacent outline icon Mail/Inbox button, both hidden when `group-data-[collapsible=icon]`) → nav groups from `sidebar-items.ts` (`SidebarGroupLabel` + links or `Collapsible` submenus; active = `path===url` or startsWith sub-url; collapsed-desktop renders `DropdownMenu side=right`; badges: `new` green / `soon` muted; `newTab` → new tab; `disabled` → aria-disabled; icon-less items get initial-letter fallback).
- `support-card.tsx`: `Card size="sm" shadow-none` + `CardHeader px-4` + `CardTitle truncate text-sm` + `CardDescription line-clamp-3` (neutral text, no links).
- `nav-user.tsx`: `SidebarMenuButton size="lg"` = `Avatar h-8 w-8 rounded-lg grayscale` + name (`truncate font-medium`) + email (`truncate text-xs text-muted-foreground`) + EllipsisVertical → dropdown (Account/Billing/Notifications/Log out).

**Header controls** (`-components/header/`):
- `SidebarTrigger` + vertical `Separator` + `SearchDialog`: link-style trigger button (`Search` icon + "Search" + `kbd ⌘J`); opens `CommandDialog` (`CommandInput` "Search dashboards, users, and more…" + groups + empty state); `Cmd/Ctrl+J` toggles; excludes `coming-soon` urls; Enter navigates (or new tab).
- `LayoutControls` (`Popover` "Preferences"): theme preset `Select` (color dot `size-2.5 rounded-full` inline style), Fonts select, `ToggleGroup size="sm" variant="outline"` rows for ThemeMode [Light/Dark/System], PageLayout [Centered/Full Width], Navbar [Sticky/Scroll], SidebarStyle [Inset/Sidebar/Floating], Collapse [Icon/OffCanvas]; "Restore Defaults" button. **All writes go through `setPreference()` (cookie-backed server fns).**
- `ThemeSwitcher`: icon button cycling light→dark→system (Monitor/Sun/Moon swap via `html[data-theme-mode]` selectors).
- `GitHubRepositoriesMenu`: icon button → `DropdownMenuContent w-48` "Project versions" + 4 placeholder (`#`) items keyed by label.
- `AccountSwitcher`: avatar trigger → `min-w-56` menu with user rows (avatar + name + role + Check when active) + Account/Billing/Notifications + Log out.

**Preferences system (MUST respect — header/layout behavior is pure CSS on `<html data-*>`):**
`theme_preset | font | theme_mode | content_layout (centered/full) | navbar_style (sticky/scroll) | sidebar_variant (inset/sidebar/floating) | sidebar_collapsible (icon/offcanvas)` — persisted via `getDashboardLayout()` route loader + `usePreferencesStore`. Pages opt into full-bleed app layouts with `data-content-padding="false"`. New screens must work under centered + full-width, sticky + scroll navbar.

**Shell mock data**: `@/data/users` = `[{id,name,username,email,avatar:"",role}]`; repositories list (labels only, hrefs `#`).

### 1b. Auth (reuse for `/login`) — 4 screens, 2 shells

**v1 split panel** (`auth/v1/login|register`): `flex h-dvh` → brand panel `hidden lg:block lg:w-1/3 bg-primary` (Command `size-12` + `font-light text-5xl` headline + `text-xl /80` sub) + form `w-full lg:w-2/3 bg-background p-8` centered `max-w-md space-y-10 py-24`. Login: `LoginForm` + outline Google + "Don't have account? Register" (`text-xs muted`, link `text-primary`).
**v2 centered** (`auth/v2/route` layout + login|register): `grid h-dvh p-2 lg:grid-cols-2` → form `sm:w-[350px] space-y-8` (h1 `text-3xl font-medium`, Google button FIRST, "Or continue with" divider `after:border-t` + `bg-background px-2` span, form, top-right switch link, bottom copyright + locale) + brand panel `hidden lg:flex rounded-3xl bg-primary` (top: logo + APP name + tagline; bottom: two help blurbs).
**Forms** (`login-form.tsx` / `register-form.tsx` / `google-button.tsx`): RHForm + `Controller` + inline Zod (`email/password min6/remember`; register adds `confirmPassword` + refine match); `FieldGroup gap-4` → `Field gap-1.5` → `FieldLabel` + `Input` + `FieldError`; remember-me = horizontal `Field` + `Checkbox` + `FieldContent`; submit `Button w-full` → `toast` with JSON `<pre>`; Google = `Button` + `SimpleIcon(siGoogle) size-4` "Continue with Google".

### 1c. Standalone 3-pane shell (`/chat`, `/mail` routes) — donor for `/ai`

```
┌──────────────┬──────────────────────────────┬────────────────────┐
│ context      │ main thread                  │ detail (chat)      │
│ sidebar      │ list + view (resizable mail) │ profile panel      │
└──────────────┴──────────────────────────────┴──────────────────┘
```
- **Chat** (`(main)/chat/`): `SidebarProvider flex-col` → `ChatHeader` (sticky h-14: title + search + New/Bell/Settings) → `ChatSidebar` (offcanvas: nav Inbox/Mentions/… + Channels with brand icons + Views + user footer) + `Chat` grid (`22.5rem` list | `1fr` thread | `20rem` profile, mobile = slide + Sheet). List = collapsible groups (Pinned/Today/Yesterday) with avatar rows, unread pills (`size-5 bg-primary/90`), online dots. Thread = `MessageScroller` + `Message align start|end` + `Bubble` variants + reactions + composer (`Textarea` + format/emoji/attach/link/AI buttons + Send). State: zustand `use-chat` (`selected` id). Message model: `{id, align, text, time, reaction?}`; contact has email/phone/company/tags.
- **Mail** (`(main)/mail/`): `MailSidebar` (icon-collapsible: accounts toggle + New email + Inbox/Priority + Folders + Help) + `ResizablePanelGroup` (38/62 split, `ResizableHandle withHandle`) + `MailView` (toolbar X/Prev/Next/Pin/Archive/Reply/More/Trash + subject/date + From/To/Cc + collapsible attachments + `whitespace-pre-wrap` body + reply box). **Layout persists via cookie**: route `loader` → `getValueFromCookie(MAIL_LAYOUT_COOKIE)` → `defaultLayout`; `onLayoutChanged` writes back. **Copy this loader pattern for any persisted UI state.** Mobile = full list + `Drawer` detail. State: zustand `use-mail`.
- **Dashboard wrappers** (`dashboard/chat|mail`): header + "open in new tab" button + full-bleed `iframe` of the standalone route. ⛔ Do not copy the iframe pattern.

### 1d. States & fallbacks (reuse as-is)

`coming-soon` (centered h1 + muted p), `not-found` (+ outline "Go back home" → dashboard), `root-error` (`error.message` in destructive DEV-only + Try again `reset()` + dashboard link), `unauthorized` (Lock icon + primary "Go to Homepage"), dashboard `$` splat (in-shell variant), `dashboard/index` + `(external)/index` (pure `redirect` beforeLoad, no UI).

## 2. Tokens, type, shape, motion (condensed — full tables in `ui-context.md`)

- **Base**: shadcn neutral OKLCH; presets neutral(default)/tangerine/brutalist/soft-pop via `data-theme-preset`; dark via `.dark`. Key values — bg `1→0.145`, fg `0.145→0.985`, card `1→0.205`, muted `0.97→0.269`, muted-fg `0.556→0.708`, primary `0.205→0.922`, border `0.922→white/10%`, destructive `0.577,0.245,27.325`, charts zinc ramp `0.87→0.269`, radius `0.625rem` (sm×0.6 md×0.8 lg×1 xl×1.4 2xl×1.8).
- **Use ONLY** `bg-background/text-foreground/bg-card/text-muted-foreground/bg-muted/bg-primary(+foreground)/border/text-destructive/chart-config colors`. Severity-only color: high=`destructive`, medium=amber, ok=emerald/green-600, info=sky — always `bg-{c}-500/10 text-{c}-700 dark:text-{c}-300` washes + `border-{c}-*/20`.
- **KNOWN hardcoded exceptions** (do not propagate): logistics map base (`#d4dadc/#2C353C` ocean, `#fafaf8/#0e0e0e` land, `#f0dddd` coast, `#ebd6d8` borders); amber alert blocks (`border-amber-200 bg-amber-50 text-amber-900 / dark amber-950`); invoice paper (`bg-neutral-50 text-neutral-950`, stone grays).
- **Type**: system stack only; page `text-3xl tracking-tight` + `text-sm muted` sub; section `text-sm uppercase muted`; card title `text-sm font-medium` (finance uses `font-normal`); numbers `tabular-nums` (+`font-mono` for IDs/money); rows `truncate`; `text-wrap:balance` on h1–h3.
- **Density**: sections `gap-6`, grids `gap-4` collapsing `grid-cols-1 xl:grid-cols-12` (spans 12/8/7/6/5/4/3), cards `p-4/p-6`, icon wells `size-9/10 rounded-md/full bg-muted`, `rounded-xl border shadow-xs|none`.
- **Icons**: `lucide-react` 16/20/24; `SimpleIcon` (`size-5 fill-foreground` default) for brand glyphs; flag classes `flag:XX` REQUIRE `@/styles/flag-icons/flags.css` import. No emoji in UI.
- **Motion**: `tw-animate-css` + transitions; `transform`/`opacity` ≤300ms `ease-out`; `prefers-reduced-motion` everywhere. Live-data motion = React re-render on tick (see patient-monitoring §7), recharts `isAnimationActive={false}` for streaming.

## 3. Primitive API catalog (`src/components/ui/` — import, NEVER modify)

Base = `@base-ui/react` + `cva` + `cn`; polymorphism via `render=`; everything carries `data-slot`. Shared extras: `date-range-picker.tsx` (`DateRangePicker value/onChange`, outline trigger, `Calendar mode=range numberOfMonths=2`), `simple-icon.tsx` (`icon` + svg props), `use-mobile` (`<768px`, SSR false), `use-lg` (`>=1024px`).

**Actions** — `Button` (variant `default|outline|secondary|ghost|destructive|link`; size `default h-8|xs|sm h-7|lg h-9|icon|icon-xs|icon-sm|icon-lg`; icons via `data-icon=inline-start|end`), `Toggle` (default|outline; default|sm|lg), `ToggleGroup/Item` (+`spacing`→`--gap`, `orientation`; items inherit), `ButtonGroup/Text/Separator` (joined controls).
**Display** — `Badge` (`default|secondary|destructive|outline|ghost|link`, `render=` polymorphic, no size — size via classes like `rounded-sm px-2.5 py-1 text-[10px]`), `Card/Header/Title/Description/Action/Content/Footer` (`Card size=default|sm`; header auto-grids when Action present), `Avatar/Image/Fallback/Badge/Group/GroupCount` (size `default 8|sm 6|lg 10`), `Skeleton` (pulse muted), `Spinner`, `Kbd/Group`, `Separator` (h|v), `AspectRatio` (`ratio` required).
**Forms** — `Input` (h-8), `Textarea` (`min-h-16`), `Label`, `Field/Set/Legend/Group/Content/Label/Title/Description/Separator/Error` (`Field orientation=vertical|horizontal|responsive`), `InputGroup(+Addon align=inline-start|inline-end|block-start|block-end, Button, Text, Input/Textarea borderless)`, `NativeSelect` (default|sm), `Select` (Trigger default|sm; Content side/align/alignItemWithTrigger), `Combobox` full suite incl. multi `Chips`, `Checkbox`/`RadioGroup(Item)` (size-4), `Switch` (default|sm), `Slider` (array values → N thumbs), `InputOTP(Group/Slot index/Separator)`, `Calendar` (react-day-picker; `buttonVariant`, range support).
**Overlays** — `Dialog(+Trigger/Close/Header/Footer/Title/Description)`, `AlertDialog(+Media/Action/Cancel; Content default|sm)`, `Sheet(Content side=top|right|bottom|left)`, `Drawer(+SwipeHandle, snapPoints, modal)`, `Popover(Content w-72 p-2.5)`, `Tooltip(Provider delay, dark bg-foreground, Kbd-safe)`, `HoverCard(w-64)`, `DropdownMenu(+Checkbox/Radio/Sub/SubTrigger/SubContent, Item default|destructive)`, `Menubar`, `ContextMenu`, `NavigationMenu`.
**Data** — `Table/Header/Body/Footer/Row/Head/Cell/Caption` (no variants — style via `**:data-[slot=table-cell]:px-4` etc.), `Tabs/List/Trigger/Content` (`TabsList variant=default(bg-muted)|line(underline :after)`), `Pagination(+Content/Item/Link(isActive)/Previous(text)/Next/Ellipsis)`, `Breadcrumb`, `Accordion`, `Collapsible`, `Carousel` (embla; Previous/Next auto-disabled), `ResizablePanelGroup/Panel/Handle(withHandle)`, `ScrollArea/Bar`, `Command(+Dialog/Input/List/Empty/Group/Item/Shortcut/Separator)` (cmdk), `Empty(+Header/Media(icon|default)/Title/Description/Content)`, `Alert(+Title/Description/Action; default|destructive)`, `Progress(+Track/Indicator/Label/Value)`, `Toast` (`Toaster` once + `toast.success/show`).
**Lists** — `Item(+Group/Media(icon|image)/Content/Title/Description/Actions/Header/Footer/Separator; variant default|outline|muted; size default|sm|xs)`, `Marker(+Icon/Content; default|separator|border)`.
**Chat/AI** — `Message(Group/Avatar/Content/Header/Footer; align start|end)`, `Bubble(Group/Content(render= polymorphic)/Reactions; variant default|secondary|muted|tinted|outline|ghost|destructive; align)`, `MessageScroller(Provider/Viewport/Content/Item/ Button direction end|start)`, `Attachment(Group/Media(icon|image)/Content/Title/Description/Actions/Trigger; state idle|uploading|processing|error|done; size; orientation)`, `Questionnaire(Progress/Item/Title/Choices/Choice(+Description/Shortcut)/Input/Error/Actions/Previous/Skip/Next/Submit)`.
**Chart** — `ChartContainer(config REQUIRED, id?)` + `ChartTooltip(+Content: indicator dot|line|dashed, hideLabel/HideIndicator, labelFormatter/formatter)` + `ChartLegend(+Content)` + `ChartConfig Record<key,{label,icon,color|theme}>` → `--color-{key}` vars. Minimal use: config `{views:{label,color:"var(--chart-1)"}}` → `<ChartContainer config className="h-64"><BarChart data><CartesianGrid/><XAxis dataKey/><ChartTooltip content/><Bar dataKey fill="var(--color-views)"/></></>`.

## 4. Chart catalog (all through `ui/chart.tsx` + recharts — verified per file)

**Wrapper idioms**: `ChartContainer config + className h-*` → chart → `CartesianGrid vertical={false}` → `XAxis(tickLine/axisLine false, tickMargin, tickFormatter)` → `YAxis hide` (visible only when units matter) → `ChartTooltip cursor={false} content=<ChartTooltipContent …/>` → series with `fill="var(--color-{key})" stroke` `dot={false}`. Config keys map dataKeys → `{label, color: var(--chart-N)}`.

| Screen → component | Type | Shows | Techniques to steal |
|---|---|---|---|
| default `performance-overview` | Composed (Area+2 Line) h-80 | 181 pts/12h: new/active/returning | gradient fills (`stopOpacity .36→.04`), top-right `ChartLegendContent justify-end`, date-only X (`minTickGap=48`) |
| default `metric-cards` | sparklines: none (text+Badge only) | — | KPI card anatomy (icon well + `text-3xl tabular-nums` + delta badge) |
| crm `pipeline-activity` | Bar h-72, `barSize=38`, 12 bars | rolling-12mo qualified (523 total) | 45° hatch `pattern` fill + `radius=[8,8,0,0]`; side stat panel (big `text-4xl` + bordered inset + `Progress`) |
| finance `transactions` | Line ×2 h-50 (dense expense 31pts + sparse income, `connectNulls`, dashed income) | week of flows | time-scale X (`scale=time`, weekday ticks), custom tooltip w/ `formatCurrency` |
| finance `balance` | Pie donut h-50 (`inner65 outer90`, `paddingAngle2 cornerRadius6`) + center `Label` total | 4 accounts | custom HTML legend (dot+name+amount+%); `formatCurrency` center |
| analytics `traffic-quality` | Composed +2 Line (solid actual 2.5 + dashed baseline) | 91 pts actual vs baseline % | dual series + `%` Y formatter |
| analytics `realtime` | Bar 30pts + custom `shape` (baseline+rounded bar, opacity by threshold, destructive on zero) | per-minute visitors | custom bar shape; live ping dot (`animate-ping` + green dot); 2×2 country flag grid |
| analytics `top-sources` | vertical Bar (`layout=vertical`, `barSize=40`) + `LabelList` insideLeft name + value label | sources | `foreignObject` not needed — LabelList only; tabbed datasets (Sources/Campaigns/Referrers) |
| ecommerce `kpi-strip` | Composed Bar(profit, opacity .18)+Area(revenue, glow `filter feGaussianBlur`) | 72 buckets | SVG glow filter; month-tick formatter showing sparse labels |
| ecommerce `store-traffic` | Area+Line `type=stepAfter` | 97×15min visitors + anomalies (destructive line) | step charts for event series; legend top-right |
| ecommerce `traffic-sources` | vertical Bar + 3 LabelLists (name+visits, brand `SimpleIcon`, ±change green/destructive) | 5 channels | icon+delta inside bars — closest idiom to "explained" rows |
| ecommerce `inventory` | Pie **semicircle gauge**, 32 segments (19/8/5 by stock status) | availability 61% | segment-count gauge; center % label |
| ecommerce `top-products` | CSS stacked bar (no recharts: `h-2` flex segments) | category share | cheapest "chart" — use for simple splits |
| academy `assignment` | grouped Bar ×3 + dotted `pattern` fills + custom legend icons | per-class submitted/pending/overdue | pattern fills distinguish series in monochrome |
| academy `performance` | vertical stacked timeline bars + **custom shape**: track + score-width fill + overlapping `Avatar`s + subject + % text | class scores 73–84% | richest custom bar — model for peer-comparison bars |
| logistics map | SVG geo (NOT recharts): `geoMercator` + `fitExtent` bbox + `geoPath`; `topojson feature` (land) + `mesh(a!==b)` (borders); dashed `stroke-primary` route; halo+dot markers + labels | route context | **India choropleth donor** — see §8 |
| patient `waveform`/`trend` | Line, `isAnimationActive={false}`, tick-driven re-render (100ms wave / 1s trend) | live vitals | streaming pattern: `useSyncExternalStore` ticker + sliding window; domain clamps per vital |
| crm-v1 `insight` | Bar + **Pie donut** + `LabelList` | source mix | donut + side legend list |
| crm-v1 `operational` | **FunnelChart** + dual LabelList (stage right, value left) | pipeline stages | only funnel in repo |
| crm-v1 `overview` | Area+Bar+Line mini cards | KPI trends | mini-chart card anatomy |
| finance-v1 `cash-flow` | **diverging stacked Bar** (`stackOffset=sign`) + `ReferenceLine y=0` | income vs expenses | pos/neg bars — model for variance charts |
| analytics-v1 | Composed Bar+Line+`ReferenceLine`+custom `Dot`+`LabelList` | forecast vs target | target lines + delta labels — model for "actual vs norm" flags |
| default-v1 | Area (90/30/7d range toggle + mobile auto-7d) + drawer mini-Area | visitors | range-toggle pattern; responsive switch |

**To add**: India state/district TopoJSON only. Never add chart libs.

## 5. Table & list patterns (copy, don't redesign)

**Full data-table** (default `recent-customers`, crm `opportunities`, tasks, users, roles, ecommerce `recent-orders`, default-v1 `proposal-sections`): `columns.tsx` + `schema.ts` (Zod) + `table.tsx` + data file; `useTable({features: dataTableFeatures})`. Anatomy: toolbar (search `Input h-7 pl-8 lg:w-80` + filter dropdowns + sort control + reset) → header (`h-11 font-medium`, hover off) → rows (`hover:bg-muted/20`, `border-border/60`, icon/avatar/badge/sparkline cells) → footer (selected count + rows-per-page `Select` + `Page X of Y` + sliding-window pagination Prev/1..N/Ellipsis/Next, `preventDefault` links). Selection = checkbox + `Subscribe(rowSelection)`; empty = `h-24 "No results."`. Column types seen: select/icon-cell (avatar+name+id)/search-hidden/status `Badge outline`/billing icon-badge/plan/joined two-line/priority/health strips/`actions` (ghost icon + menu)/mono IDs/`tabular-nums` amounts.
**Grouped table** (roles): `bg-muted` group header rows with counts + permission `Badge` stacks + `+N` overflow + permission-gated row menu (System roles disable Edit/Duplicate/Archive).
**Simple lists**: schedule rows (time stripe + subject + status badge, `divide-y`, `hover:bg-muted/30`), event rows (date-block + title + type badge), shipment cards (id + conic-gradient progress ring + flag origin→dest + dashed progress track + cargo/ETA), file rows/cards, review rows. **Conic progress ring** (logistics): `--angle` + `conic-gradient(currentColor …)` + inner `bg-card` dot.
**Meters**: `ResourceMeter` (infra: label + % + `h-1.5` bar; emerald <55 / amber ≥55 / destructive ≥70), `Progress h-2/h-2.5`, kanban building cards, academy timelines.
**URL-state pattern** (file-manager, copy verbatim): `validateSearch` whitelist (`?view=grid|list` → default grid) + `Route.useSearch()` + `ToggleGroup` items rendering as `Link … search={prev=>…} replace`. Use for ANY view toggle (queue group-by, dossier tabs deep-link).
**Persisted layout pattern** (mail): route `loader` reads cookie server fn → `defaultLayout` → `ResizablePanelGroup` → `onLayoutChanged` writes back. Copy for resizable dossier panes.

## 6. Overlays, forms, feedback — where used + MUST-WIRE list

- **Used**: `Tabs variant="line"` everywhere (finance/accounts, analytics 5-tab with dashed "coming soon" placeholders — copy that placeholder idiom, profile 6-tab scrollable, logistics detail tabs, roles tabs); `DropdownMenu` row/toolbar menus (+`Sub` in file-manager filter); `Sheet` (logistics mobile detail, kanban none); `Drawer` (mail mobile, default-v1 row editor); `Popover` (invoice date pickers, infra RiskView/Filters); `CommandDialog` (search); `Alert` amber blocks (logistics handling, roles review) + destructive error; `toast` (form submits, default-v1 inline edits); `Empty` (folders zero-state); `Skeleton` (loading rows); `AlertDialog` available, **unused in screens — use for Dismissed/Action-Required confirms**.
- **Dead buttons found (visual only — MVP MUST wire or remove)**: file-manager New folder/Upload + all row menus except star; infrastructure search/filters/Add Environment/Refresh/row menus; logistics status tabs/search/Sliders/Copy/Call; kanban Add/Filter/Sort/Import; ecommerce selects/sort; tasks row actions; profile Edit/Add/Org chart; roles Create/Import/Review; invoice Save/Send/Add Client/PDF; calendar Add event + calendar filter; academy/chat/mail header actions. **Rule: no dead buttons on MVP demo paths — every visible control either works or is absent.**

## 7. Page catalog (ASCII + verdict). Legend: ✅ REUSE · 🔧 ADAPT · 📖 REFERENCE · ⛔ SKIP

### Dashboards

**Default** `/dashboard/default` (route + metric-cards/performance-overview/subscriber-overview/data.json + recent-customers-table/) — exec customer overview. 🔧 ADAPT → Overview KPIs + queue.
```
[4 KPI cards: icon-well + $1,250.00/+12.5% | 1,234/−20% | 45,678/+12.5% | 4.5%]
[Card: Customer Activity + period/segment selects + View report → ComposedChart h-80]
[Card: 18,426 Customers + Export → search/status/joined/billing/sort toolbar → table → footer]
```
Cards: metric (no sparkline) / alert-style KPI w/ green +12% vs destructive −20% badges / customer icon-cells + billing status icons (Paid green-check / Pending Loader / Overdue amber / Trial) / joined two-line cells. Table: select + controlled sort (dropdown only) + page-size footer. Mock: 60-row `data.json` (plan/status/billing/joined).

**CRM** `/dashboard/crm` (kpi-cards/pipeline-activity/task-reminders/opportunities-section + opportunities-table/) — pipeline cockpit. 🔧 ADAPT → Works table twin.
```
[Pipeline Overview h2 + 4 KPIs: $284.5K/+12% | 28.4%/−2.5% | 42/+7 | 18.1%]
[Card Qualified Lead Flow + range select → BarChart h-72 (pattern bars) + 523-leads side panel + Discovery inset + Progress]
[Meetings card (time ruler + demo pill 22–44% + View Calendar) | Goal card (12/18, 42 mini-bars, 67%)]
[Card Recent Opportunities → search + Stage/Health dropdowns → ID/Account/Stage/Priority/Health-strips/Value/Edit table → numbered pagination]
```
Health = 18 vertical strips (green scale); priority all "1" in mock; 132-row `data.json` + Zod.

**Finance** `/dashboard/finance` (8 components) — money hub. 🔧 ADAPT → dossier financials.
```
Personal Finances + date → line-tabs(Dashboard|Accounts|Transactions) + Updated/Settings/Export
[6-col OverviewKpis 2×2 | IncomeBreakdown 3 dashed cols + Credit-score Item]
[7-col Transactions LineChart | 5-col Balance donut + 4-row legend]
[Wallet banks+crypto+air-gapped vault | Upcoming $1,245 bills + autopay pill | Quick Transfer avatars+$-input + 8 shortcut round buttons]
```
`TabsContent` others = dashed "coming soon". Donut center total; income bars `bg-chart-3` alpha steps.

**Analytics** `/dashboard/analytics` — traffic console. 🔧 ADAPT → Overview tab shell.
```
Hello, Aiy → 5 line-tabs + range select + actions menu
[5-joined KPI strip: 213.1k/+2.8% … 8.4%/−5.6%]
[7-col TrafficQuality Composed | 5-col Realtime (24/min + ping + bar + flag grid US/GB/CA/IN)]
[7-col Page Performance table | 5-col Traffic Sources (inner tabs Sources/Campaigns/Referrers)]
```

**Productivity** (9/3 grid, greeting "Good morning.") — morning planner. 📖 density model.
```
[SummaryCards×3 (Today 4 / Week 68% / Focus 90:00)] [Tasks list + day select + New]
[Projects×3 cards (68/42/31% + due)] [QuickActions×5] [Quote banner]
| [CalendarPanel] [FocusCard Start] [RecentNotes×4] [Weekly 4/6 + Progress]
```
Checkbox-toggles tasks live (`useState`); rest static.

**E-commerce** — store mosaic + strongest filter header. 🔧 ADAPT → Works header.
```
Store Overview + date | [period select][channel select] | gear
[12-col KpiStrip: 6 mini-KPIs + Sales Composed(glow)] [5 Traffic Area+Line | 7 Sources h-bar+icons]
[Top Products stacked-bar+grid | Inventory gauge+3 stats | Reviews quote+carousel+avatars]
[Recent Orders: status ToggleGroup + sort + full table + pagination]
```
Payment/Fulfillment badge matrix (green/amber/destructive washes); 34-row orders + Zod.

**Academy** — teacher console. 📖 lists + timeline bars.
```
Academy Dashboard + [Announcement][Gradebook][Add Assignment] → 4 KPIs (badged)
[5-col Class Schedule: time-stripe rows ×5 + status badges | 7-col Assignment grouped-Bar]
[8-col Performance stacked-timeline bars (avatar+subject+score) | 4-col Upcoming Events date-blocks]
```
Live dates via date-fns; striped/pattern bar fills in monochrome.

**Logistics** `/dashboard/logistics` — 400px queue + map + dossier tabs (THE master-detail to steal). 🔧 ADAPT → map + dossier shape.
```
[Queue Card: Shipments + sliders | line-tabs All(156)/Transit(32)/Delivered(98)/Delayed(9) | search | 24 ShipmentCards]
→ click → [Map 320/420px SVG] + [line-tabs Overview|Route|Cargo|Documents|Activity → ID+Copy+badge+%+ETA | customer+trip | 5-cell cargo grid | amber handling Alert + tags]
```
Mobile: detail becomes full `Sheet`. Tabs/search mostly visual (only selection works) — MVP wires them.

**Infrastructure** — fleet health board. 📖 status-row idiom.
```
Infrastructure Overview + Updated/refresh/gear → 4 badges (6 Projects/16 Environments/36 Servers/99.93%) → search⌘K + 6 filter buttons
→ per-org Collapsible: trigger org(name) + Add Environment + ⋮ menu → 1700px table: Domain|Platform(icon)|Env|Health(dot)|Latency|Uptime|CPU·RAM·Disk meters|Server+flag|terminal-menu
```
Meters threshold-colored; empty org = dashed "No environments".

**File Manager** — folders + `?view=` grid/list. 🔧 ADAPT → dossier Evidence (copy toggle verbatim).
```
My files + [New folder][Upload] → search + Filter&sort (Show/Type/Sort submenus) → 6 folder Cards → All files + Grid|List ToggleGroup → preview-cards (hover star, kind·size footer) OR table (icon-link name + Shared badge + avatar owner)
```
Star state per-view `useState`; menus mostly dead (star works).

**Patient Monitoring** — full-bleed live console. 📖 console chrome + streaming pattern.
```
STATUS BAR (name | 10 Patients | clock + alarm/net tooltips) → [20rem patient grid (cards: bed+alarm badge, ECG mini-wave, HR/SpO₂) | detail: header + amber Alert banner + 5 traces + 6 numerics + line-tabs(trends/events/live/disclosure)] → FOOTER action bar
```
10fps tick re-render, `isAnimationActive={false}`, per-vital domains/colors; ack flow amber→muted. Steal chrome + tick hook for live risk feed later.

### Pages group + standalone + legacy

**Chat `/chat`** (header + sidebar + list + thread + profile + zustand + 24 seeded convos). 🔧 ADAPT → `/ai` copilot.
```
[Sticky header: Studio Chat + search | New/Bell/Settings] → [nav(Inbox/Channels/Views)+user | conversation groups Pinned/Today/Yesterday (avatar rows, unread pills, online dots) | thread (back/bubble/MessageScroller/composer tabs reply|note) | profile (quick actions + Details/Files/Activity tabs)]
```
`Message align start|end` + `Bubble` variants + reactions; composer formatting/emoji/attach/AI buttons. Rename "Studio Chat" → copilot in MVP.

**Mail `/mail`** (sidebar + resizable 38/62 + view + drawer-mobile + cookie layout). 🔧 loader pattern; inbox UI ⛔.
```
[accounts + New email + Inbox/Priority + Folders + Help] | [Inbox header + search + Pinned/Inbox groups (selected = muted + primary bar)] | [toolbar + subject/date + From/To/Cc + collapsible attachments + pre-wrap body + reply]
```

**Calendar** — FullCalendar (dayGridMonth/timeGridWeek/Day) + toolbar (calendar select, prev/Today/next `ButtonGroup`, view select, primary Add event) + themed event chrome (today pill, destructive now-line, background wash). Select filters nothing (visual); drag/resize styled, unwired. ⛔ SKIP (pattern only).

**Kanban** — dnd-kit 5-col board (Ideas/Planned/Building/QA/Shipped, 17 tasks): toolbar tabs Board/List/Table (visual) + search + Filter/Sort + Add-split (Import/Template/Automation); columns sortable by Grip; cards (priority badge / owner avatar+name / due / insights counts; Building variant = progress + team badge; Shipped = green Done); `DragOverlay` tilted clone; 7 owners with color `tone`s. ⛔ SKIP (dossier status = buttons per chat study).

**Tasks** — filterable table masterclass. 🔧 ADAPT → Works filters.
```
Welcome back! → [Card: search + Status/Priority multi-check dropdowns + Reset + View-columns menu → select/ID mono/Title(menu-sort + label badge)/Status badge/Priority/actions-label-menu table → selected-count + rows-per-page + sliding pagination]
```
Status model (backlog/todo/in progress/done/canceled + tone map) ≈ investigation states; label radio in row menu.

**Invoice** — form⇄live-preview splitter. 📖 form+preview + print.
```
Create New Invoice + [Save Draft][Send] → [form Card: Invoice|Payment|Business tabs + Details(dates) + Billed-To avatar select + sortable Items (grip/qty/price/total/trash) + Tax/Discount($/% switch)] | [Preview Card: Print/PDF → scaled 816×1056 paper (absolute-center hook) + portal print root]
```
Single RHF + `useWatch` sync; `INVOICE_PAPER_*` consts; `window.print()`; totals helpers in `data.ts`.

**Profile** — dossier skeleton twin. 🔧 ADAPT → work dossier tabs.
```
Breadcrumb Dashboard/People/Directory/name → header (progress-ring avatar + name/email/title + Complete/Verified/Contractor/Remote badges + Email/Edit/⋮) → scrollable line-tabs(Overview|Personal|Employment|Compensation🔒|Time off|Documents) → 3-col overview+status aside / dl grids / gated lock block / leave blocks / documents table (Restricted vs Download)
```
Read-only `dl` grids (`dt muted xs / dd sm`); compensation = permission-gated pattern to copy.

**Users** — member directory Card (search⌘K + Hide/Customize/Export/Add + Role/Team/Status/Workspace selects + list/grid toggle → avatar table + presence dots + row menus → footer). 📖 simplest full table wiring (25 rows, `getRowId=email`, default joined-desc sort).
**Roles** — grouped catalog (System/Custom/Needs-review group headers + counts + amber review Alert + Type/Owner/Status selects + fixed 9-col table + single-number pagination + permission-gated menus). 📖 grouping + gating.
**Legacy v1 ×4** (default/crm/finance/analytics): 📖 charts only (drawer editors, Funnel, diverging bars, forecast Driver/ Sobolev-chips + risk ledger table) — never structure.
**Misc**: `dashboard/chat|mail` = iframe previews ⛔; `coming-soon/not-found/root-error/unauthorized/$-splat` = state templates ✅ reuse; `(external)/` + `dashboard/index` = pure redirects.

## 8. Map deep dive (`logistics/-components/shipment-route-map.tsx`, 220 lines — India donor)

- **Imports**: `d3-geo` (`geoMercator`, `geoPath`) + `topojson-client` (`feature`, `mesh`) only. No leaflet/mapbox — keep it dependency-free.
- **Data**: remote `world-atlas@2 countries-110m.json` fetched client-side in `useEffect` (cancel flag; failure → ocean + route only). `feature(objects.land)` fill + `mesh(objects.countries, a!==b)` interior borders. 110m = coarse; fine for context zoom.
- **Projection**: fresh `geoMercator()` per render; with shipment → `fitExtent([[72,72],[928,448]], bbox)` where bbox = midpoint ± `max(span*1.85, 10°lon/8°lat)` closed LineString; without → static `center([102,17]) scale 760`. Route = 2-point LineString (Mercator curve, no waypoints).
- **SVG**: `viewBox 0 0 1000 520 meet` letterboxed in 320/420px row; ocean rect + land + borders + dashed `stroke-primary` route (`dash 8 8, w3`) + per-point `<g>`: halo `r8 fill-background stroke-primary w3` + dot `r3 fill-primary` + `text-[10px] fill-foreground` label.
- **For India**: same file shape, swap source to India state/district TopoJSON (TO ADD — open question), `fitExtent` to India bbox, color states by risk (emerald/amber/destructive washes on `fill`, keep zinc base), click state → filter queue. No pan/zoom controls needed for MVP (fit-to-data suffices).

## 9. MVP reuse map (donor → route)

| MVP route | Clone in order |
|-----------|---------------|
| `/login` | auth v1/v2 verbatim |
| `/overview` | default KPIs + analytics tab shell + ecommerce header + tasks toolbar + §8 map + default-v1 section-cards |
| `/works` | crm opportunities-table + tasks filters + ecommerce header + file-manager `validateSearch` toggle |
| `/works/:workId` | profile tab skeleton + finance cards + file-manager evidence + invoice timeline + chat thread + badge severity + roles gating |
| `/ai` | chat 3-pane + questionnaire + mail loader |

## 10. File index per screen (exact — nothing is ever "lost")

**Shell**: `dashboard/route.tsx` + `-components/header/{account-switcher,github-repositories-menu,layout-controls,search-dialog,theme-switcher}.tsx` + `-components/sidebar/{app-sidebar,nav-main,nav-user,support-card}.tsx` + `navigation/sidebar/sidebar-items.ts` + `config/app-config.ts` + `data/users.ts`.
**Auth**: `auth/v1/{login,register}/route.tsx` + `auth/v2/{route,login/register}.tsx` + `-components/{login-form,register-form}.tsx` + `-components/social-auth/google-button.tsx`.
**Default**: `route.tsx` + `metric-cards,performance-overview,subscriber-overview,data.json` + `recent-customers-table/{columns,schema,table}.tsx`.
**CRM**: `route.tsx` + `kpi-cards,pipeline-activity,task-reminders,opportunities-section` + `opportunities-table/{columns,schema,data.json}`.
**Finance**: `route.tsx` + `overview-kpis,income-breakdown,finance-notification,transactions-overview-card,balance-distribution-card,wallet,upcoming-transactions,quick-actions`.
**Analytics**: `route.tsx` + `analytics-kpi-strip,analytics-toolbar,realtime-visitors,top-pages,top-traffic-sources,traffic-quality` (+ `styles/flag-icons/flags.css`).
**Productivity**: `route.tsx` + `calendar-panel,focus-card,projects-section,quick-actions,quote-card,recent-notes-card,summary-cards,tasks-section,weekly-summary-card`.
**E-commerce**: `route.tsx` + `customer-reviews,inventory,kpi-strip,recent-orders,store-traffic,top-products,traffic-sources` + `recent-orders-table/{columns,data.json,formatters,schema}`.
**Academy**: `route.tsx` + `assignment-status,class-schedule,kpi-cards,performance-highlights,upcoming-events`.
**Logistics**: `route.tsx` + `logistics,shipment-data,shipment-details,shipment-list,shipment-route-map` (+ flags.css).
**Infrastructure**: `route.tsx` + `infrastructure-data,infrastructure-header,project-environments` (+ flags.css).
**File Manager**: `route.tsx` + `data,file-actions,file-grid-view,file-list-view,file-manager-toolbar,folders-section`.
**Patient Monitoring**: `route.tsx` + `patient-monitoring,patient-card,patient-detail,patient-trends,vital-waveform,chart-grid,data,waveform-data,realtime-utils,use-patient-vital-series,use-realtime-tick`.
**Chat (standalone)**: `route.tsx` + `chat,chat-conversation-list,chat-header,chat-profile-details,chat-sidebar,chat-thread,data,use-chat`.
**Mail (standalone)**: `route.tsx` + `mail,mail-inbox,mail-layout-config,mail-list,mail-sidebar,mail-view,data,use-mail`.
**Dashboard Chat/Mail**: single `route.tsx` each (iframe wrappers, §1c).
**Calendar**: `route.tsx` + `calendar,events-data` + shared `components/calendar/event-calendar-views.tsx` (frozen).
**Kanban**: `route.tsx` + `data,kanban,kanban-column,sortable-task-card,task-card,types,utils`.
**Tasks**: `route.tsx` + `columns,data,tasks,tasks-toolbar,task-priority-filter,task-status-filter`.
**Invoice**: `route.tsx` + `invoice,invoice-form,invoice-details,invoice-items,invoice-adjustments,invoice-preview,invoice-paper,print-invoice,client-selector,use-visible-center-position,data`.
**Profile**: `route.tsx` + `profile-data,profile-header,profile-overview,profile-personal-details,profile-employment-details,profile-time-off-details,profile-documents,profile-status-sidebar`.
**Users**: `route.tsx` + `data,users,users-columns,users-table`.
**Roles**: `route.tsx` + `roles` + `roles-table/{columns,data,table}`.
**Legacy**: `(legacy)/default-v1` (chart-area-interactive,section-cards,proposal-sections-table/*,data.json) · `crm-v1` (overview/insight/operational-cards,crm.config,recent-leads-table/*) · `finance-v1` (card-overview,cash-flow-overview,income-reliability,spending-breakdown,kpis/*) · `analytics-v1` (overview,drivers-forecast-target,drivers-coverage-triage,actions-manager-queue,actions-risk-ledger).
**Misc**: `dashboard/coming-soon, dashboard/$, dashboard/index, (main)/unauthorized, (external)/index, -components/{not-found,root-error}, __root, router, routeTree.gen (generated)`.
**Shared**: `components/ui/*` (61, §3) + `components/{calendar,date-range-picker,simple-icon}` + `hooks/{use-mobile,use-lg}` + `lib/{utils,data-table-features,cookie,local-storage,fonts,preferences/*}` + `stores/preferences/*` + `server/server-actions.ts` + `styles/{styles.css,presets/*,flag-icons/*}`.

## 11. New-page checklist (every time)

1. Closest §7 page named and cloned (state it in your reply).
2. Primitives §3 only; charts §4 only; tokens §2 only.
3. `route.tsx` < ~60 lines; logic in `-components/`; mock in `data.ts` typed by Zod.
4. `skeleton`/`empty`/`alert`/coming-soon states; dark + mobile; keyboard/ARIA.
5. Nav added to `sidebar-items.ts`; nothing touched in `ui/`/`calendar/`/`routeTree.gen.ts`.
6. Every visible control works or is absent (§6 must-wire list).
7. Every anomaly render: peer N + median-vs-actual + ≥1 corroborating signal.

