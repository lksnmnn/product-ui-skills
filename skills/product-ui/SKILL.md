---
name: product-ui
description: Rules for building application screens as work surfaces — purpose, every screen size, navigation, density, hierarchy, lists, forms, copy, states, ergonomics — plus a review procedure with a screenshot script. Use when building, changing or reviewing a screen, view, list, table, form, dialog or dashboard in a web or desktop app, or when a UI looks generic, template-made or AI-made.
---

# Product UI

An application is a **work surface**: people come back to it to get a job done. Every element
earns its place by serving that job. The target is **earned familiarity** — a person fluent in
tools of this category trusts each control on sight, and the interface disappears into the task.

These rules hold for any app. What is specific to one project — device targets, design system,
components, direction, known drift — lives in the **project file**; build from it. Before calling
a screen done, run [review.md](review.md).

## The project file

Look for it in this order: a path named in `CLAUDE.md` or `AGENTS.md`, then
`.claude/product-ui.md`. When none exists, create `.claude/product-ui.md` from
[templates/project.md](templates/project.md) before the first build:

1. Find the design system: token files (CSS custom properties, a Tailwind theme, a tokens JSON),
   the component library (in-repo `components/ui`, shadcn, MUI, Radix, …), story files.
2. List the building blocks a screen needs (page scaffold, table, form field, empty state,
   dialog, toast, …) with their paths. Mark each missing one as missing; never invent a path.
3. Note the drift you saw on the way: places where the code breaks a rule below.
4. Ask the user for the device targets per app and who owns the visual language (a design team,
   or the developers). Suggest targets from the app's intent.

Write only what you verified. Point `CLAUDE.md` at the file so later sessions find it.

When the project has no visual direction and the surface should not look generic, run the
`design-direction` skill first; it records its result in the same file.

## Purpose first

Before layout, write down in one line each:

- the **job** the screen serves and the person doing it;
- the **first read**: the one thing they look at when the screen opens;
- the **primary action** and how often they repeat it;
- the **target devices**: phone, tablet, laptop, large screen, from the project file.

Every region on the screen maps to one of those lines. A region that maps to none is cut.

## Real content

Build and judge with content shaped like production: real names of realistic length, the longest
plausible title, 0, 1, 7 and 500 items, a missing optional value, a translation 30% longer than
English. "John Doe", "Acme Inc", "Lorem ipsum", "Item 1" and round numbers hide every layout
problem and are the first thing that makes a screen look generated. When the domain's data is
unknown, ask for a sample or derive one from the schema.

## Every size

A screen is optimised for its primary device and works at every other breakpoint with the same
features. Each size gets the pattern that fits it, not a squeezed copy of the desktop: a sidebar
becomes a drawer or icon rail, a table becomes a stacked list, a split pane becomes a page with a
back step, hover becomes a visible control, a dense toolbar becomes an overflow menu. A feature
that disappears below a breakpoint is a finding.

Nothing scrolls sideways at a target width: not the page, and not a list inside its own container.
Free-text columns (names, titles, emails, filenames) shrink and truncate with the full text on
hover; only a genuinely wide grid (a matrix, a timeline) may scroll, and it says so.

On large monitors content keeps a readable measure: text blocks stay under ~75 characters per
line, forms keep their column width, and a table may grow while its free-text columns take the
space.

## Navigation

- Global navigation lists the app's sections and stays the same on every screen.
- A section with its own sub-areas may add one local layer (a second column or tabs). Each layer
  shows its own level only: no layer repeats another's entries, and two entries never share a
  label.
- Scope — which organisation, workspace or account the screen acts on — is set by a switcher,
  shown once.
- Every page is at most two choices from global navigation, and local navigation stays visible on
  the primary device.
- Chrome above the first control stays small: a breadcrumb never repeats the page title beneath it.
- An app with more than a handful of sections or many records offers a jump-anywhere search
  (⌘K / Ctrl+K) that finds pages and records by name or pasted id.

## Density

- Show the working set at once. A list a person scans or compares is a **table** with one row per
  item; a card grid is for few items whose picture or preview is the content.
- Row height follows content: one-line rows 36–44px, a row with a second line or a thumbnail up to
  64px; padding never takes more height than the content.
- The gap between related items is smaller than the gap between groups, so grouping reads from
  spacing alone.
- Every element in a row earns its place. Test each one:
  - **task**: it serves finding, comparing, opening or acting on the item, for this screen's job;
  - **erase**: removing it loses something the person needs; otherwise it goes, or moves to the
    detail view;
  - **redundancy**: it repeats no column, active filter or page heading;
  - **self-explanatory**: it reads without hover, tooltip or legend, and a status is a word, never
    colour alone;
  - **order**: what identifies the item first, then the facts people compare, actions last.

  A missing fact is a finding too: when people open item after item to compare one value, that
  value belongs in the row.
- One line per row by default. Secondary facts sit in their own column or a muted second line,
  never in a tooltip the person must hover to compare.
- Headings, descriptions and helper text are as short as the job allows. A page description that
  repeats the title is cut.
- Whitespace separates groups; it never pads a sparse screen into looking full.
- A box (border, background, shadow) marks a thing the person acts on as a unit. Grouping alone
  is done with space or a rule; a card inside a card is a finding.

## Hierarchy

- One primary action per view, visually primary, at the top right of its scope (page header or
  panel header). Secondary actions are outline or ghost; destructive ones sit last.
- Every size, space, colour and radius comes from the surface's **design system** and stays
  inside it. An arbitrary value (`text-[10px]`, `p-[13px]`, a raw hex) is a finding; the fix is
  the nearest step, or a new token when no step fits.
- Weight and colour carry hierarchy before size does.
- Colour carries meaning: the accent marks the primary action, selection and state. Status
  colour appears only where a status exists.
- Icons accompany a label where they speed recognition (navigation, frequent actions) and stand
  alone only for universal actions (close, search, more) with an accessible name. An icon on every
  button, heading or card is decoration.
- A read-only value renders as text, never as an input.
- A control the viewer's role cannot use is hidden, decided by the same capability the server
  checks. When knowing the action exists matters, it shows disabled with the reason ("Only admins
  can invite").
- Copy names what people recognise, not the infrastructure behind it: no vendor or pipeline names
  unless the audience works with them directly. Navigation lists no unbuilt or switched-off
  feature.

## Copy

Interface text is part of the design and the fastest giveaway of a generated screen.

- A button says what it does, as a verb and its object: "Invite member", "Export CSV". Never
  "Submit", "OK", "Click here", "Get started" inside an app.
- The confirm button repeats the verb of the question: "Delete 3 files?" → "Delete files".
- Sentence case for every label, heading and button. No exclamation marks, no "Oops", no
  "Successfully", no "Please".
- Feedback states the result in the person's terms: "Invoice sent to finance@…", not "Operation
  completed successfully".
- An empty state says what belongs here and how it gets here, in one or two plain sentences. No
  wit, no illustration filler, no "Nothing to see here".
- No marketing voice inside a tool: cut "seamless", "effortless", "powerful", "unlock",
  "supercharge", "magic", "AI-powered" and any sentence that praises the product.
- One term per concept across the app; the glossary lives in the project file.
- Numbers, dates and units follow one format per app; counts use the right plural ("1 file",
  "2 files").

## Lists and tables

- Numbers right-aligned with `tabular-nums`; text left-aligned.
- Timestamps use one fixed format per app, never the browser's locale default, and are never
  truncated. Monitoring screens pair relative time ("3 min ago") with the absolute one on hover,
  or the reverse.
- Headers name the column in one or two words; sortable headers sort on click.
- Search, filters, sort, page and the opened item live in the URL, so a view survives reload,
  back, and a shared link.
- A row is a real link to its item: the whole row opens it, and Cmd-click opens a new tab.
- Every reference in a row — a person, an organisation, a job, an id — links to its own page.
- Per-row actions sit at the row's end in a stable column, visible at rest; at minimum they show on
  touch screens. A control that takes clicks while invisible is a bug.
- Bulk work gets selection checkboxes, a select-all, and a bulk-action bar when the person handles
  items in batches.
- Pagination or windowing past ~50 rows; the count is always visible. A filter that bounds the set
  (a month range) replaces paging when the bound is shown.
- Filter chips can carry counts; then they double as the page's summary.

## Forms

- Labels above fields, one column, in the order the person thinks about the data.
- Validate on blur and on submit; the error sits under its field and says how to fix it.
- Defaults are the most common answer. Optional fields are marked optional, required ones are not
  marked.
- Submit on a create or action form stays enabled. Submitting invalid input focuses the first
  invalid field and shows how to fix it under that field.
- Save on an edit form may stay disabled until something changed, since nothing waits to be
  saved; once anything changes it is enabled, the rule above applies, and an "Unsaved changes"
  hint beside it shows the state.
- One save per view. Leaving with unsaved changes asks first.
- A control is disabled while its own action is pending, so it cannot fire twice.
- A short form or a single field edits **inline**; a dialog is for a focused task that must not
  lose its context.
- Inputs use the right type and `autocomplete` (email, tel, one-time-code, …) so phones show the
  right keyboard and browsers fill them.
- A file-upload trigger is a focusable button that opens the picker, and also accepts a drop.
- A page that configures what another surface draws (an onboarding, a brand, a template) shows a
  preview of that surface beside its settings.

## Actions and feedback

- An action with a way back (restore, unarchive, reactivate) runs immediately and offers **undo**,
  with no confirm on top. A toggle is its own undo and needs only immediate feedback.
- An action with no way back gets a confirm that names what is lost ("Delete 3 documents"). An
  action that looks reversible but has no reverse is treated as irreversible until the reverse
  exists.
- Every action answers within 100ms: optimistic update, pending state on the control, or a
  skeleton where content will land.
- Work that takes longer than a few seconds runs in the background with visible progress, and
  survives navigation.
- Errors say what happened and what to do next, next to where it happened.

## The state matrix

Every view ships all of its states, designed, not defaulted:

| State          | Shape                                                                           |
| -------------- | ------------------------------------------------------------------------------- |
| loading        | a skeleton in the layout the content will take                                  |
| empty          | says what belongs here and offers the action to add it                          |
| filtered-empty | says the filter matched nothing and offers to clear it                          |
| partial        | the parts that loaded render; the failed part shows its own error, never a zero |
| no access      | says who can see this and how to get access, and offers a way onward            |
| error          | what failed, a retry, the rest of the screen still usable                       |
| full           | the real content at realistic volume, long names and many rows included         |

Every interactive control has default, hover, focus-visible, active, disabled and pending.

On a dashboard, each tile and chart owns its states: a failed read shows its own error, never a
zero or an empty chart. A dashboard opens on what needs attention, not on a row of metric cards;
a number appears only with the comparison that makes it meaningful (target, last period) and a
definition the team agrees on. Charts follow the `dataviz` skill when it is installed.

## Accessibility and themes

- Body text meets 4.5:1 contrast, large text and control boundaries 3:1, in every theme. Muted
  grey on grey is the most common failure.
- Focus is always visible and never clipped; the focus ring is designed, not the browser default
  removed.
- Every control has an accessible name; an icon-only button gets `aria-label`. Landmarks (`nav`,
  `main`) and one `h1` per page.
- Text resizes to 200% and the layout holds.
- When the app supports a dark theme, it is designed: its own surface steps and a re-tuned
  accent, not inverted colours. Review every screen in both.

## Ergonomics

- The primary task completes from the keyboard: tab order follows reading order, Enter submits,
  Escape closes, focus returns where it came from.
- Click targets are at least 24×24px, frequent ones larger, 44px on touch; the hit area covers the
  whole row or label, not just the icon.
- Frequent actions sit close to what they act on. Distance and clicks to a repeated action are a
  cost the design pays down.
- Motion is 150–250ms and shows a change of state; a screen loads straight into its task.
- A brand moment (an intro, a celebration) plays at most once per session, leaves the screen
  usable while it runs (any key or click skips it), and is skipped under `prefers-reduced-motion`.
- After an interruption a person resumes where they were: scroll position, open item, filters.
