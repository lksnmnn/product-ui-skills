# Product UI — project file

Read by the `product-ui` and `design-direction` skills before every build and review. Keep it
true: a path listed here exists, a missing block says missing. Delete the hints in parentheses
once a section is filled.

# Device targets

| App          | Primary              | Also works on, with the same features | Note |
| ------------ | -------------------- | ------------------------------------- | ---- |
| (path or name) | (phone / tablet / laptop / desktop ≥1280px) | (the other sizes) | (who uses it where) |

# Design system

| App   | Design system                                        | Who decides                                      |
| ----- | ---------------------------------------------------- | ------------------------------------------------ |
| (app) | (token file path, component library, scale it falls back to) | (a design team: rule breaks are discussion points; or the developers) |

# Direction

(Written by `design-direction`: mode, personality, tokens, graphic devices, signature move,
anti-references, open definitions, and the date it was set. Leave empty until then.)

# Glossary

| Term | Means | Never call it |
| ---- | ----- | ------------- |
| (the word the UI uses) | (definition the team agrees on) | (synonyms to avoid) |

# Building blocks

Reach for these before writing markup. A screen composed from them inherits spacing, type and
states that already agree with the rest of the app.

| Need                                   | Use                    |
| -------------------------------------- | ---------------------- |
| page scaffold (title, description, actions) | |
| grouped content surface                | |
| button (variants, sizes, pending)      | |
| form field (label, hint, error, optional) | |
| table (whole-row link, sort, selection, stacked on phones) | |
| paging                                 | |
| search                                 | |
| filter chips / select                  | |
| status label                           | |
| timestamp                              | |
| loading skeleton                       | |
| empty / filtered-empty / error state   | |
| dialog, confirm, drawer                | |
| side preview (list → detail)           | |
| toast with undo                        | |
| row overflow menu                      | |
| file upload trigger                    | |
| unsaved-changes guard                  | |
| capability / permission gate           | |
| URL state (filters, page, opened item) | |
| jump-anywhere search (⌘K)              | |
| data reads / writes                    | |

Tokens: (where the type scale, colours, radius and spacing live; how to add a token).

Stories / previews: (how to render components in isolation, if the project has it).

# Rendering for review

- Start the app: (commands, ports, which env)
- Log in: (test users per role, or a storage-state file; never commit real credentials)
- Playwright: (where it is installed, e.g. `e2e/package.json`)
- Quirks: (inner scroll container to flatten with `UNSCROLL`, onboarding to skip, seed for volume)

# Known drift

Places where the code breaks a rule on purpose or by history, so a change near them moves
toward the rule rather than copying the drift.

- (file:line — what it does — the rule it breaks)
