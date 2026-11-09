---
name: design-direction
description: Interviews the person to set a distinctive visual direction — brand, world, graphic devices, signature move — before UI is built, so the result looks like this product and no other. Use when starting or restyling an app, a landing page, a deck or a page that should not look generic, or when a design reads as template, theme or AI default.
---

# Design direction

A design is **distinctive** when someone who knows the field would attribute it to this one
product. Usability comes from familiar structure; distinctiveness comes from what only this
product has: its brand, its **world**, its **graphic devices** and one **signature move**. Those
come from the person, so this skill asks before it draws.

A generator left alone converges on the same few looks ([defaults.md](defaults.md)). Every
decision below either comes from the interview or is checked against that list; nothing is
chosen because it is the first thing that comes to mind.

Done when a direction is written down, chosen by the person, and every later build reads it.

## 1. Collect what exists

Ask for, and read, whatever already defines the brand: logo files, colours, fonts, brand
guidelines, photography, illustrations, earlier decks or pages, a design-system file in the repo,
and the project file of the `product-ui` skill (`.claude/product-ui.md`) if one exists. An
existing system is the starting point; the direction extends it and never contradicts it. Record
which assets exist and which are missing.

## 2. Interview

Run [interview.md](interview.md): a few questions per round, each round building on the answers
before it. Ask, listen, follow the surprising answer one level deeper. The round is done when you
can state the product's world, personality and anti-references back in one paragraph and the
person agrees with it.

## 3. Mode

Decide the **mode** from the interview:

- **Operate** (an application people work in): structure, navigation and controls stay the
  familiar ones of the category. The direction contributes type, palette, density, graphic devices
  in the quiet areas (headers, empty states, onboarding, loading) and one signature move.
- **Persuade** (a landing page, a campaign, a deck): the direction may shape the whole page —
  composition, imagery, motion, layout.

A product with both gets one direction and applies it per mode.

## 4. Propose directions

Write two or three directions that differ at a glance, each from the interview's material. Each
one names:

- **tokens**: palette (4–6 named colours with roles), type pairing and scale, radius, borders,
  elevation, density. Build them with [tokens.md](tokens.md) from the brand assets of step 1 — a
  reference product lends its qualities (speed, density), never its colours or type;
- **graphic devices**: a shape language and geometry taken from the product's world, and a recipe
  for generated backgrounds, patterns and filler images built from those forms;
- **imagery**: what photography or illustration shows, and how it is cropped and treated;
- **structure**: grid, rhythm, how a screen or page is composed;
- **voice**: three words for how the interface speaks, and one sample sentence each for a
  button, an empty state and an error;
- **signature move**: one concrete, nameable idea a viewer remembers ("status drawn as …");
- **a sample**: one real screen or section rendered in it, with real content.

Show the samples side by side, at the same size, with the same content. The person picks one, or
combines parts, and says why.

Every number and label on a sample needs a definition the person agrees with ("active users":
logged in? in a session today?). Collect the ones they question as open definitions; they are
product questions, and they go into the record of step 6.

When the person says it still looks generic but cannot name why, split the surface into
independent toggles — typeface, palette, shape (radius, borders, chips), density, icon style — on
the same screen, and let them switch each one until the feeling goes. The toggle that removes it
names the cause.

## 5. Check distinctiveness

Hold the chosen sample against [defaults.md](defaults.md) and against the person's
anti-references. For each match, change the decision that produced it, or record why this product
keeps it. Then the attribution test, weighed by the surface's distinctiveness level from the
interview: with the logo covered, would someone who knows the field name this product? At a high
level, "it could be anyone's" sends you back to step 4 with the weakest element. At a low level, a
clean familiar result passes, and the record says so.

Distinctiveness never costs usability: a signature move that hides a control, lowers contrast
or breaks a familiar pattern of the category is moved to a quiet area or dropped.

## 6. Record

Write the direction into the "Direction" section of the project file (`.claude/product-ui.md`,
or where `CLAUDE.md` says the project keeps its design decisions; create it from the
`product-ui` template when missing): the date, mode, tokens, devices, imagery recipe, structure,
voice, signature move, the anti-references, the open definitions, and the interview answers that
justify them. Put the tokens themselves into the code's token file. Later builds and reviews read
the project file first.
