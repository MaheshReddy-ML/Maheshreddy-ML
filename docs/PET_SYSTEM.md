# Living notebook pets

## Foundation research (21 September 2026)

Evaluated primary source code and licensing before implementation:

| Candidate | License and source | Animation / integration assessment | Decision |
| --- | --- | --- | --- |
| [oneko.js](https://github.com/adryd325/oneko.js/tree/5281d057c4ea9bd4f6f997ee96ba30491aed16c0) | MIT, copyright 2022 adryd; complete notice in `public/licenses/oneko-MIT.txt` | Small browser-native implementation, directional sprite sets, normalized pursuit, alert delay, idle/scratch/tired/sleep sequences, throttled rAF. Single global pet; no touch, keyboard, petting or navigation-aware integration. Easy to audit and extend. | Selected code foundation; retain upstream source alongside adaptation. No upstream sprites used. |
| [VS Code Pets](https://github.com/tonybaloney/vscode-pets) | MIT, Anthony Shaw | Rich typed state objects, walk/run/lie/climb/land/chase/friend transitions and frame results. Strong multiple-pet model; extension/webview lifecycle and bundled character assets require extra integration and asset-level review. Keyboard/mobile support needs a web-specific layer. | Studied `src/panel/states.ts`; no code or artwork copied. More extension machinery than this site needs. |
| [pet_cursor.js](https://github.com/alienmelon/pet_cursor.js) | No repository-level license found in root listing at review time; not treated as permission to redistribute | Straightforward sprite cursor facing, idle and link reactions; desktop-oriented global cursor handlers. Less suitable for touch or non-following autonomous companions. | Architecture reference only; no code or artwork copied. |

The final system is an adaptation, not an unmodified dependency. `src/lib/pets/engine.ts` preserves oneko's normalized pursuit equation, alert-before-motion and frame-indexed idle/sleep architecture. It adds timed autonomy, per-species profiles, interruptible interactions, acceleration, bounded drop/bounce, cooldowns and deterministic test injection. The inspected upstream source is retained in `src/lib/pets/oneko.upstream.txt`. No heavyweight physics dependency or proprietary characters.

## Artwork

`public/pets/notebook-pets.png` is an original OpenAI image-generated transparent raster sheet created for this project on 21 September 2026: 8 poses × 5 species, 1586 × 992. Not extracted from a game or extension. It has no third-party character asset attribution requirement. The renderer uses measured row boundaries because the generated grid is not mathematically exact. The pickup poses depict supporting hands. The former Cat and Companion SVG components have been replaced by these living raster creatures in their original page illustration positions. There is no separate pet strip. Technical diagrams and interface icons remain unchanged.

## Behavior and safety

- The cat replaces the cover/about/skills illustration and accompanies Emora. The robot lives beside projects, MiniGPT and sign language; the fox accompanies GitHub and governance/data studies; the penguin keeps research company; the dog sits beside contact. Each instance uses the same independently clocked engine with its species' personality. Pages show their own creature rather than a permanent five-pet strip.
- Idle → curious → walk → rest → stretch/sleep → wake, plus blinking and breathing. Alert delays ordinary pursuit. Opt-in following tracks the current cursor position every frame, starts promptly despite section cooldowns, settles beside a stationary cursor, and pauses over links and controls. Fast cursor play outside follow mode has a cooldown. Cat pupils/head react to pointer direction.
- Slow strokes accumulate 650ms before petting. A stationary hover does not pet. Touch long press uses 550ms; short tap requests curiosity. Drag starts after 7px and uses pointer capture. Release integrates gravity, damping and recovery. The creature starts in its former illustration footprint, then moves through document coordinates across the page. Two-dimensional pursuit and wandering, pointer capture, edge scrolling during drag, and a new landing position allow it to leave that footprint completely. Roaming pets reduce their display size to stay unobtrusive.
- Enter/Space pets; all four arrows move horizontally/vertically; Home returns to the original artwork position; W wakes. The small Pet world control offers Pet/Wake/Move over/Come here alternatives with spoken action status. It is portalled outside the illustration so it does not inherit transforms or clipping.
- IntersectionObserver and project/diagram clicks trigger contextual investigation with 24-second cooldowns, including Emora, MiniGPT, SentinelAI, sign language and customer intelligence. Project and diagram targets map to their document positions.
- Pause, wander, follow, quiet, hide and reduced-motion preferences persist locally with storage error handling. OS reduced motion takes precedence and updates live. Quiet suppresses thought bubbles; no audio is requested or played.
- Natural document scrolling is preserved. A pointer-transparent document overlay contains the actual creature button. The pet stays fully opaque and keeps its grab cursor and pointer interaction after every drop, including over text or controls. A short click over an underlying link/control activates that control; moving beyond the drag threshold or long-pressing belongs to the pet and never activates it. The same short-click behavior is available while paused or in reduced-motion mode. Thought bubbles are suppressed over content. A grabbed pet retains capture until release. Come here retrieves an offscreen pet into the current viewport. The former illustration area is only its starting point, with no movement boundary. The settings menu closes on outside click or Escape without stealing Escape when closed. No document-wide preventDefault or touch interception.
- On mobile there is one page-appropriate creature with reduced dimensions and touch controls. Former rules that hid the old heading SVGs are overridden so the replacement pets remain available.
- Each mounted illustration uses a capped-timestep rAF loop and at most 30fps canvas painting, one shared cached WebP resource, and no per-frame React renders. Hidden tabs suspend rAF. Offscreen pets suspend rAF during autonomous wandering, while explicit follow mode keeps them moving toward the pointer across the document. Paused/reduced modes render once. Sprite loading begins on the client, not as a blocking document resource.

## Validation

Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `QA_ORIGIN=http://127.0.0.1:5173 npm run qa:pets` with the Vite server on port 5173. Browser checks exercise real pointer strokes, drag/drop, keyboard actions, desktop/mobile cast, navigation, preference persistence, OS motion preference, accessibility and frame timing. Reports are written to the ignored `qa/` directory.

Browser timing is local evidence, not a guarantee on all hardware. Physical mobile devices, Safari/Firefox and subjective character believability still need human acceptance. Generated walk-frame differences are subtle at the small display size.

### Recorded local acceptance — 23 September 2026

- 16 unit tests passed (11 pet engine scenarios, 5 content/data tests).
- Dedicated Chromium pet checks cover live cursor following and offscreen pursuit, repeated pickup after dropping over content, full opacity and grab cursors, page-wide dragging, two-axis keyboard movement, offscreen retrieval, navigation click-through, and inline replacement across character-bearing route types, offscreen suspension outside follow mode, real mouse strokes, captured drag/recovery, real CDP touch long-press/drag/release, keyboard/menu alternatives, OS reduced motion, preference persistence and accessibility. Visibility suspension is exercised by a simulated `document.hidden` transition; it is not a physical background-device power test.
- Existing interaction regression suite passed, including Axe checks in dark mode across 15 routes, diagrams, filters, clipboard, responsive navigation and recovery pages.
- TypeScript, lint and Netlify-targeted Vite build passed.
- Local 120-frame sample: mean 16.61 ms, zero frames above 50 ms. This supports the local no-stalls acceptance only; it is not a universal CPU/battery or before/after benchmark.
- Runtime atlas uses a 398,516-byte WebP derivative; the original PNG is retained for provenance. No live external asset request is needed.

The transferred pet system retains page-wide movement from its original illustration location. The separate strip is removed; gesture-based click forwarding protects navigation without fading or disabling the pet. The subjective “feels alive” goal and physical-device acceptance remain human judgments rather than claims that automation can prove.
