// Screenshots each route full-page at every review width and reports what screenshots hide:
// horizontal overflow, small click targets, controls without a name, console errors.
//
// usage: node capture.mjs --url <appUrl> --routes <routes.json> --out <dir>
//          [--user <u> --password <p> [--login-path /login]] [--storage <state.json>]
//          [--dark] [--widths 1440x900,390x844]
//
// routes.json: [{ "name", "path" } | { "name", "from", "linkPattern" }]; the second form opens
// `from` and follows the first link whose href matches the regex.
// env: PLAYWRIGHT_FROM=<dir> where @playwright/test or playwright is installed (default: cwd);
// UNSCROLL=<css> to flatten an inner scroll container; SETTLE_MS (default 1500);
// FAIL_TEXT=<regex> overrides the error text that makes a capture retry, then fail.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const { values: opt } = parseArgs({
  options: {
    url: { type: "string" },
    routes: { type: "string" },
    out: { type: "string" },
    user: { type: "string" },
    password: { type: "string" },
    "login-path": { type: "string", default: "" },
    storage: { type: "string" },
    dark: { type: "boolean", default: false },
    widths: { type: "string" },
  },
});
if (!opt.url || !opt.routes || !opt.out) {
  console.error("usage: node capture.mjs --url <appUrl> --routes <routes.json> --out <dir> [--user u --password p] [--storage state.json] [--dark]");
  process.exit(2);
}

function loadChromium() {
  const require = createRequire(resolve(process.env.PLAYWRIGHT_FROM ?? process.cwd(), "package.json"));
  for (const name of ["@playwright/test", "playwright"]) {
    try {
      return require(name).chromium;
    } catch {}
  }
  console.error("Playwright not found. Install it (npm i -D playwright && npx playwright install chromium)\nor set PLAYWRIGHT_FROM to the directory whose node_modules has it.");
  process.exit(2);
}

const appUrl = opt.url.replace(/\/$/, "");
const out = opt.out;
const routes = JSON.parse(readFileSync(opt.routes, "utf8"));
const settleMs = Number(process.env.SETTLE_MS ?? 1500);
// A page caught mid-restart of a backend shows one of these; it is retried, then reported.
const failText = new RegExp(process.env.FAIL_TEXT ?? "not reachable|failed to fetch|something went wrong", "i");
const WIDTHS = opt.widths
  ? opt.widths.split(",").map((w) => {
      const [width, height] = w.split("x").map(Number);
      return [width, height || 900, `${width}`];
    })
  : [
      [1440, 900, "desktop"],
      [1024, 768, "laptop"],
      [768, 1024, "tablet"],
      [390, 844, "mobile"],
    ];
const MONITORS = [1920, 2560, 3440];
const suffix = opt.dark ? "-dark" : "";
mkdirSync(out, { recursive: true });

const chromium = loadChromium();
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: WIDTHS[0][0], height: WIDTHS[0][1] },
  reducedMotion: "reduce",
  colorScheme: opt.dark ? "dark" : "light",
  ...(opt.storage ? { storageState: opt.storage } : {}),
});
const page = await ctx.newPage();
let consoleLog = [];
// "Failed to load resource" carries no URL; the response listener reports those with theirs.
page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && consoleLog.push(m.text().slice(0, 160)));
page.on("pageerror", (e) => consoleLog.push(String(e).slice(0, 160)));
page.on("requestfailed", (r) => consoleLog.push(`request failed: ${r.url().slice(0, 120)}`));
page.on("response", (r) => r.status() >= 400 && consoleLog.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 120)}`));

async function settle() {
  await page.waitForLoadState("networkidle").catch(() => {});
  if (process.env.UNSCROLL) await page.addStyleTag({ content: process.env.UNSCROLL }).catch(() => {});
  await page.waitForTimeout(settleMs);
}

// Fills a login form, also one split over several steps (username first, then password), as
// many identity providers do. Stops when no login field is left.
async function login() {
  await page.goto(appUrl + opt["login-path"], { waitUntil: "networkidle" });
  const pw = page.locator('input[type="password"]').first();
  const name = page
    .locator('input[autocomplete="username"], input[type="email"], input[name*="user" i], input[name*="login" i], input[type="text"]')
    .first();
  for (let step = 0; step < 6; step++) {
    const pwVisible = await pw.isVisible().catch(() => false);
    const nameVisible = await name.isVisible().catch(() => false);
    if (!pwVisible && !nameVisible) return;
    if (nameVisible && !(await name.inputValue().catch(() => ""))) await name.fill(opt.user);
    if (pwVisible) await pw.fill(opt.password);
    const submit = page.locator('button[type="submit"], input[type="submit"]').first();
    if (await submit.isVisible().catch(() => false)) await submit.click().catch(() => {});
    else await (pwVisible ? pw : name).press("Enter");
    await settle();
    // A form that answers with an error will not get past it on a retry.
    const message = await page
      .locator('[role="alert"], .alert, .invalid-feedback, .error, .text-danger, [aria-live]')
      .filter({ hasText: /\S/ })
      .first()
      .innerText({ timeout: 500 })
      .catch(() => "");
    if (pwVisible && message && (await pw.isVisible().catch(() => false))) {
      await page.screenshot({ path: `${out}/_login-stuck.png` });
      throw new Error(`login failed: ${message.trim().slice(0, 200)}`);
    }
  }
  await page.screenshot({ path: `${out}/_login-stuck.png` });
  throw new Error(`login form still shown after 6 steps, at ${page.url()}`);
}

// Runs in the page: everything a full-page screenshot does not show.
function inspect() {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
  };
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("href") || "").trim().slice(0, 30);
    return `${el.tagName.toLowerCase()}${id}${text ? ` "${text}"` : ""}`;
  };
  const overflow = [document.documentElement, ...document.querySelectorAll("*")]
    .filter((el) => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== "visible")
    // Visually hidden text (1px boxes) and ellipsis truncation are intended, not overflow.
    .filter((el) => el.clientWidth > 1 && getComputedStyle(el).textOverflow !== "ellipsis")
    .map((el) => `${describe(el)} ${el.scrollWidth}>${el.clientWidth}`);
  const controls = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="tab"]')].filter(visible);
  // Inline links inside running text are exempt from the target size (WCAG 2.5.8).
  const inText = (el) => el.tagName === "A" && el.parentElement && /^(P|LI|SPAN|TD)$/.test(el.parentElement.tagName) && el.parentElement.innerText.length > el.innerText.length + 20;
  const small = controls
    .filter((el) => !inText(el))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width < 24 || r.height < 24;
    })
    .map((el) => {
      const r = el.getBoundingClientRect();
      return `${describe(el)} ${Math.round(r.width)}×${Math.round(r.height)}`;
    });
  const labelled = (el) =>
    el.getAttribute("aria-label") ||
    el.getAttribute("aria-labelledby") ||
    el.getAttribute("title") ||
    (el.labels && el.labels.length) ||
    el.getAttribute("placeholder") ||
    (el.innerText || "").trim() ||
    el.querySelector("img[alt]:not([alt=''])") ||
    (el.type === "submit" && el.value);
  const unnamed = controls.filter((el) => !labelled(el)).map(describe);
  return { overflow, small, unnamed };
}

const only = (list, max = 8) => (list.length > max ? [...list.slice(0, max), `… ${list.length - max} more`] : list);

if (opt.user && opt.password) await login();
const report = [];
for (const r of routes) {
  try {
    let url = r.path != null ? appUrl + r.path : null;
    const findings = { overflow: {}, small: [], unnamed: [], console: [] };
    if (!url) {
      await page.goto(appUrl + r.from);
      await settle();
      const href = await page.$$eval(
        "a[href]",
        (as, pat) => as.map((a) => a.getAttribute("href")).find((h) => h && new RegExp(pat).test(h)) ?? null,
        r.linkPattern,
      );
      if (!href) throw new Error(`no link matching ${r.linkPattern} on ${r.from}`);
      url = new URL(href, appUrl + "/").href;
    }
    for (const [width, height, tag] of WIDTHS) {
      await page.setViewportSize({ width, height });
      for (let attempt = 0; ; attempt++) {
        consoleLog = [];
        await page.goto(url);
        await settle();
        if (await page.$("vite-error-overlay, nextjs-portal [data-nextjs-dialog]")) throw new Error(`build error overlay on ${url}`);
        const text = await page.evaluate(() => document.body.innerText);
        if (!failText.test(text)) break;
        if (attempt === 4) throw new Error(`error text on ${url}: ${text.match(failText)?.[0]}`);
        await page.waitForTimeout(5000);
      }
      const seen = await page.evaluate(inspect);
      if (seen.overflow.length) findings.overflow[tag] = only(seen.overflow);
      for (const s of seen.small) if (!findings.small.includes(s)) findings.small.push(s);
      for (const s of seen.unnamed) if (!findings.unnamed.includes(s)) findings.unnamed.push(s);
      for (const s of consoleLog) if (!findings.console.includes(s)) findings.console.push(s);
      // An autofocused field scrolls the page; a full-page capture then draws fixed headers mid-page.
      const scrolled = await page.evaluate(() => window.scrollY);
      if (scrolled > 0) findings.scrolled = Math.max(findings.scrolled ?? 0, scrolled);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `${out}/${r.name}-${tag}${suffix}.png`, fullPage: true });
    }
    for (const width of MONITORS) {
      await page.setViewportSize({ width, height: 1080 });
      await page.goto(url);
      await settle();
      const { overflow } = await page.evaluate(inspect);
      if (overflow.length) findings.overflow[`w${width}`] = only(overflow);
    }
    const entry = { name: r.name, url: page.url(), ok: true };
    if (Object.keys(findings.overflow).length) entry.overflow = findings.overflow;
    for (const key of ["small", "unnamed", "console"]) if (findings[key].length) entry[key] = only(findings[key], 12);
    if (findings.scrolled) entry.scrolled = findings.scrolled;
    report.push(entry);
  } catch (e) {
    await page.screenshot({ path: `${out}/${r.name}-error${suffix}.png` }).catch(() => {});
    report.push({ name: r.name, ok: false, error: String(e).slice(0, 200) });
  }
}
writeFileSync(`${out}/_report${suffix}.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log(
  report
    .map((r) => {
      if (!r.ok) return `ERR  ${r.name} ${r.error}`;
      const flags = [r.overflow && "WIDE", r.small && `small-targets:${r.small.length}`, r.unnamed && `unnamed:${r.unnamed.length}`, r.console && `console:${r.console.length}`, r.scrolled && `opens-scrolled:${r.scrolled}px`].filter(Boolean);
      return `${flags.length ? "FIND" : "ok  "} ${r.name} ${r.url}${flags.length ? "  " + flags.join(" ") : ""}`;
    })
    .join("\n") + `\nscreenshots and _report${suffix}.json in ${out}`,
);
