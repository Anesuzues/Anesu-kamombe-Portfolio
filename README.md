# Anesu Kamombe · 3D Portfolio

Single-page interactive portfolio. A cut-out character lives on a three.js stage behind the content:

- walks in on load and strides across the stage (6-frame side-view walk cycle) as you scroll
- takes a different pose and a small 3D set for each section (orbits, desk, floating screens, books, confetti)
- takes idle breaks, falls asleep if you go quiet, reacts when you hover project cards or the CV button
- dances when clicked, and facepalms when clicked too much

On small screens the 3D backdrop stays and he becomes a fixed corner companion.

## Stack

React · TypeScript · Vite · three.js (`@react-three/fiber`, `@react-three/drei`) · Framer Motion · Tailwind CSS

## Structure

- `src/data/content.ts`: all copy (profile, skills, experience, projects, certifications) and the per-section pose / quip.
- `src/components/scene/`: the 3D stage (`Scene.tsx`), per-section sets (`Sets.tsx`) and the animated character (`Character.tsx`).
- `src/lib/companion.ts`: event bus the page uses to make the character react.
- `src/components/Sections.tsx`: the HTML content sections.
- `public/ava/`: character sprites (17 poses plus 5 walk frames), portrait and expression avatars.

## Development

```bash
npm install
npm run dev
npm run build
```
