# product-ui-skills

Two Claude Code skills for building application UI that works like a good tool and looks like
your product, not like a starter template or an AI default.

- **product-ui**: rules for application screens as work surfaces (purpose, real content, every
  screen size, navigation, density, hierarchy, copy, lists, forms, actions, the state matrix,
  accessibility, ergonomics), a review procedure, and a capture script that screenshots routes
  at every width and reports overflow, small click targets, unnamed controls, console and
  request errors, and pages that open scrolled.
- **design-direction**: an interview that sets a distinctive visual direction (world,
  personality, references, the one thing), builds tokens from it, proposes directions, checks
  them against a catalogue of generic and AI-default looks, and records the result.

## Install

As a plugin (recommended, updates with `/plugin update`):

```
/plugin marketplace add lksnmnn/product-ui-skills
/plugin install product-ui-skills@product-ui-skills
```

Or copy the folders from `skills/` into one of:

- `~/.claude/skills/`: available in every project
- `<project>/.claude/skills/`: one project only (commit them to share with the team)

Install both skills together; they reference each other's files. Restart Claude Code; `/skills`
lists them. They also trigger on their own when you build or review a screen.

## How it works in a project

Nothing in the skills is project-specific. What belongs to one project lives in that project, in
a **project file** (`.claude/product-ui.md` by default, or wherever `CLAUDE.md` points):

- device targets per app, and who owns the visual language;
- the visual direction set by `design-direction`;
- a glossary, so the UI uses one term per concept;
- the building blocks (components and hooks) a screen should be composed from;
- how to start and log in to the app for a review;
- known drift from the rules.

On first use, `product-ui` scans the repo, fills the file from
[`skills/product-ui/templates/project.md`](skills/product-ui/templates/project.md) and asks you
for what it cannot find. Commit the file; it is what makes the next session build like the last.

Typical flow:

1. New product or restyle: "run design-direction for the dashboard". Answer the interview, pick
   a direction.
2. Build: "build the invoices list" — `product-ui` reads the project file and builds from the
   project's components.
3. Review: "review the invoices screen" — renders it, walks the rules and the state matrix, and
   reports findings ranked by how often a person hits them.

## The capture script

`skills/product-ui/capture.mjs` needs Node 18+ and Playwright
(`npm i -D playwright && npx playwright install chromium`). It looks for Playwright from the
current directory; set `PLAYWRIGHT_FROM=<dir>` when it is installed elsewhere (for example an
`e2e/` package).

```
node <skills>/product-ui/capture.mjs --url http://localhost:3000 \
  --routes routes.json --out .review/shots \
  [--user me@example.com --password … [--login-path /login]] \
  [--storage auth.json] [--dark] [--widths 1440x900,390x844]
```

`routes.json` lists `{ "name", "path" }` entries, or `{ "name", "from", "linkPattern" }` to follow
the first matching link on a page; see
[`routes.example.json`](skills/product-ui/routes.example.json). Login handles single-step and
two-step (username, then password) forms; for SSO, pass a Playwright storage-state file with
`--storage` instead. Screenshots and `_report.json` go to `--out`; keep that folder out of git.

Environment: `UNSCROLL=<css>` flattens an app that scrolls inside an element, `SETTLE_MS`
(default 1500) waits after load, `FAIL_TEXT=<regex>` sets the error text that makes a capture
retry.

## Contributing

Rules are written as testable statements: each one can get a verdict (pass, fail, n/a) on a
real screen. A new rule says what to do, not what to avoid alone, and fits the voice of the
section it joins. New entries in `defaults.md` name a look concretely enough to spot in a
screenshot.

## License

MIT, see [LICENSE](LICENSE).
