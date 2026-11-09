# Review a screen

Run against the rendered screen, not the code alone. Done when every line below has a verdict
(pass, fail with the fix, or n/a with a reason).

1. **Render it**, by the first path that works, and say in the report which one you took:
   - **Live:** start the app as the project file's "Rendering for review" says, in the
     background, then run

     ```
     node <skill-dir>/capture.mjs --url <appUrl> --routes <routes.json> --out <dir> \
       [--user <user> --password <password> | --storage <state.json>] [--dark]
     ```

     It logs in through a form if credentials are given, and saves full-page screenshots at
     1440, 1024, 768 and 390px with motion reduced. For each route its report marks:
     - `WIDE` when the page or any scroll container is wider than its box — a horizontal-scroll
       finding the screenshots hide, because the scroll sits inside the table. It also checks
       1920, 2560 and 3440 (external monitors) for overflow without screenshots;
     - `small-targets`: visible controls under 24×24px;
     - `unnamed`: buttons, links and inputs with no accessible name;
     - `console`: errors logged, and requests that failed or answered 4xx/5xx while the page
       loaded;
     - `opens-scrolled`: the page did not open at the top (an autofocused field or a scroll
       script), so the person lands past its first content.

     Notes:
     - An app that scrolls inside an element instead of the document stops every capture at the
       viewport; flatten it with `UNSCROLL='<css>'`, e.g.
       `UNSCROLL='main{overflow:visible!important;height:auto!important}'`.
     - Skip first-run onboarding or tours for the test user first, or they cover every page.
     - Capture once per role that changes the page.
     - A redirect route is reviewed as code; its capture only repeats the target.
     - Seed realistic volume when the local data lacks it: long names, 50+ rows, an empty
       account. Otherwise judge volume from the code and say so.
   - **Stories:** render the page's stories (Storybook, Ladle, Histoire, …) and screenshot them
     with the same script, routes pointing at the story URLs. A page with no page-level story
     gets one listed as a finding.
   - **Code only:** read the route and every component it composes, and estimate vertical space
     from the classes. Every rendered check below then reads "not run".
2. **Purpose.** Name the job, the first read and the primary action from the screenshot alone.
   If you cannot, the hierarchy fails. Then **reachability**: name every way a person arrives here
   (nav, links, redirects, notifications, deep links). A route nothing links to, or one that
   duplicates another screen's flow, is a finding.
3. **Rules.** Walk every section of [SKILL.md](SKILL.md) — content, sizes, navigation, density,
   hierarchy, copy, lists, forms, actions, accessibility, ergonomics — and record a verdict per
   rule that applies.
4. **State matrix.** Force each state (throttle, empty fixture, failing request, filter with no
   match) and screenshot it. Every row of the matrix has a screenshot or an n/a.
5. **Keyboard pass.** Complete the primary task with the keyboard only; note every trap and every
   step that needed the mouse.
6. **Consistency.** Compare against one neighbouring screen: the same action looks and sits the
   same way on both.
7. **Generic check.** Hold the screenshots against
   [../design-direction/defaults.md](../design-direction/defaults.md) and the project file's
   direction. Each match is a finding unless the direction keeps it on purpose. Then the squint
   test: blurred, with the logo covered, does it read as this product or as any starter template?

Report the failures ranked by how often the person hits them, each with file:line and the fix.

In an app whose visual language a design team owns (project file, Design system), a rule break
that comes from that design is reported as a **discussion point** for them, with the reason in
the person's terms, never as a failure to fix in code.

A rule break the repo records on purpose (a README, an ADR, a comment) is still reported, marked
**documented decision**, ranked below the others, with the recorded reason quoted beside the
person's cost. Trace it to its commit (`git log -S`, `git log -L`) and say which kind it is: a
choice made for the person, or the accepted cost of another goal. For a cost, check whether a
design meets both goals and propose it.

New drift found during the review goes into the project file's "Known drift".
