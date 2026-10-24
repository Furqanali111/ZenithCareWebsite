# Screen Reader Test Script

**Why**: axe, Lighthouse and keyboard checks are done and clean, but they cannot tell you how a page sounds. Run this once before launch and after any large layout change. About 45 minutes.

**Tools** (all free): NVDA on Windows with Firefox or Chrome. Optional second pass: VoiceOver on an iPhone (Settings, Accessibility, VoiceOver) with Safari.

**Basics (NVDA)**: `H` next heading, `D` next landmark, `K` next link, `F` next form field, `Insert+F7` elements list, `Insert+Space` toggle browse/focus mode, `Ctrl` stops speech. Close your eyes or turn the monitor off for the first pass.

## 1. Every page type (home, a service page, an article, /pricing, /about)

| Check | Expected | Result |
|---|---|---|
| Page title is announced on load | Matches the visible page (for example "Pricing and Billing Model") | |
| `Tab` once | "Skip to main content" is announced; Enter jumps to the content | |
| `D` through landmarks | banner, navigation (Primary), main, contentinfo; the WhatsApp button sits in its own labelled region | |
| `H` through headings | One level 1, levels never skip, text makes sense out of context | |
| `Insert+F7` links list | No "click here" or "read more" without context; link purpose clear | |
| Images | Logo reads "Zenith Care Solutions"; decorative images are silent | |

## 2. Navigation

| Check | Expected | Result |
|---|---|---|
| Desktop: Tab to "Services" | Menu items are reachable and read as links; focus is visible | |
| Phone width: "Open navigation menu" | Announced as a button with "collapsed"; Enter opens a dialog | |
| Inside the dialog | Focus stays inside, links are read, Escape closes, focus returns to the button | |
| Theme toggle | Announced as "Toggle color theme" button | |

## 3. Forms and widgets

| Check | Expected | Result |
|---|---|---|
| /contact: `F` through fields | Each field's label is read, required fields say "required", no patient information warning is skipped | |
| Submit with an empty required field | Browser or page announces the problem and moves focus to it | |
| Submit a valid test message | "Thanks, your message is in" is announced (status region) without moving focus away | |
| FAQ accordion | Each question is a button with "collapsed/expanded"; the answer is read after opening | |
| Calendly embed | Reaching it does not trap focus; the "Open the booking calendar" link works as an alternative | |

## 4. Tables

| Check | Expected | Result |
|---|---|---|
| Code tables in the articles | Header cells are announced with each data cell (`Ctrl+Alt+arrows` moves between cells) | |

## Record

Date, tester, NVDA and browser versions, and anything that failed with the page and exact wording heard. Open an issue per failure and fix in a `defect/` branch.
