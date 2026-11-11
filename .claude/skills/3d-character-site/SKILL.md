---
name: 3d-character-site
description: Build a 3D scroll-driven website starring an animated cut-out character made from a person's character sheet or photos (walk cycle, per-section poses, reactions). Use when asked for a 3D portfolio or landing page "with my picture moving on it", or to add or regenerate character poses for one.
---

# 3D character website

A proven recipe. The reference implementation is this repository: copy from it rather than starting from zero.

## 1. What to build

One page, three layers:

1. A fixed full-screen three.js canvas (`@react-three/fiber` + `@react-three/drei`) behind everything.
2. Ordinary HTML sections on top, each with `data-section="<index>"`. The content column sits on the opposite side from the character.
3. On screens below 1024px, skip the 3D character and show a fixed DOM sprite in the bottom corner instead. A character behind stacked cards is invisible on a phone.

Key files to reuse:

| File | Role |
| --- | --- |
| `src/data/content.ts` | All copy, the per-section `pose` / `side` / `quip` / `accent`, sprite sizes, walk cycle |
| `src/components/scene/Scene.tsx` | Canvas, camera rig, floor, portal ring, decor |
| `src/components/scene/Character.tsx` | Sprite state machine: walk, pose, idle breaks, sleep, click, reactions |
| `src/components/scene/Sets.tsx` | One small prop set per section, scaled in and out |
| `src/components/Companion.tsx` | Small-screen DOM version of the character |
| `src/lib/companion.ts` | Event bus (`companion.react({ pose, quip })`) and idle timer |

## 2. Character art pipeline

Source sheets are usually low resolution (a pose is about 250px tall). Do not ship those.

1. **Generate, don't upscale, when an image tool is available.** Upload a high-res crop of the face/outfit plus the pose row as references, and ask for:
   - a side-view walk cycle: 6 full-body frames in one row, facing right, 16:9;
   - standing poses and seated poses as two separate 2x4 grids, 1:1.
   Always ask for: same scale in every cell, wide gaps so figures never touch, head to shoes visible, and a perfectly uniform light grey background with no floor, gradient, shadow or text.
   Check the cost first (`get_cost`), and check the plan allows the model before planning a budget around it.
2. **Cut out** with `scripts/split.py <sheet.png> <outdir> <count>` (needs `pip install rembg opencv-contrib-python-headless`; the `isnet-general-use` model downloads from GitHub releases). It mattes the sheet, splits by connected component and re-mattes each figure. If two figures touch, pass a cut: `x,y0,y1` as an extra argument for a vertical gap, or `POLY="x,y;x,y;..."` for a slanted one.
3. **Normalise scale** so the head is the same size in every sprite. Sheets come back at different scales; seated sheets are usually larger (0.72 was the factor here).
4. **Walk frames need an anchor.** Store `ax` (head centre as a fraction of width) per frame and offset the mesh by `(0.5 - ax) * width`, or the body jitters. Drop any frame with a smeared foot and reuse a neighbour.
5. Export WebP with alpha at about 950px tall for a standing figure, and record `{ w, h, ax? }` in `spriteSizes`.

Fallback when no generator is available: `scripts/pth2onnx.py` converts Real-ESRGAN x4plus weights (a GitHub release download) to ONNX without PyTorch, and `scripts/upscale.py` runs it on CPU. It sharpens edges but leaves small faces looking illustrated.

## 3. Behaviour rules that matter

- Advance the walk frame by **distance travelled**, not time (`STEP` about 0.46 world units for a 3.3-unit-tall figure), so feet don't slide.
- Compute stage positions from the settled camera (`2 * tan(fov/2) * distance * aspect`), not `useThree().viewport`, which is stale while the camera animates.
- Clamp animation `dt` to 0.05 but movement `dt` to about 0.12, or slow devices walk in slow motion.
- Load the first pose, show the character, then stream the rest. Never block on all sprites.
- With `eventSource` set to the root element, drei `<Html>` portals into the scrolling page. Give it a fixed overlay via `portal`.
- Mirror a directional pose (pointing) so it faces the content side.
- Keep every reaction on the event bus so page content never imports scene code.

## 4. Environment gotchas (cloud sessions)

- Downloaded binaries cannot be run. Model weights are fine; convert and run them with pip-installed runtimes.
- PyTorch wheels and Hugging Face downloads are usually blocked. GitHub release assets work.
- Image tools upload to and serve from hosts the session may block. Expect to add an upload host and one or more CDN hosts to the environment's allowed list, and note the result CDN can differ from the upload CDN.
- Headless Chromium uses software GL and runs at a few fps. Wait 10 seconds or more after a scroll before judging an arrival pose.

## 5. Before calling it done

- `tsc --noEmit` and the production build pass.
- Screenshot every section on desktop, plus an emulated phone and tablet; check `scrollWidth` does not exceed the viewport.
- Verify: intro walk-in, walk cycle, arrival pose per section, click reaction, hover reactions, speech bubble position.
- Add the share image (1200x630), canonical URL, Open Graph/Twitter tags, JSON-LD and sitemap using the real production domain.
- Tell the user what was not tested (real phones, Safari, Firefox) and any flaws in generated art.
