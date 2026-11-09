# Anesu Kamombe · 3D Portfolio

Single-page interactive portfolio. A cut-out character (built from the AVA character sheet) lives on a
three.js stage behind the content: he walks across the stage as you scroll, strikes a different pose for
each section, takes coffee breaks when idle, and dances when clicked.

## Stack

React · TypeScript · Vite · three.js (`@react-three/fiber`, `@react-three/drei`) · Framer Motion · Tailwind CSS

## Structure

- `src/data/content.ts`: all copy (profile, skills, experience, projects, certifications) and the per-section pose / quip.
- `src/components/scene/`: the 3D stage (`Scene.tsx`) and the animated character (`Character.tsx`).
- `src/components/Sections.tsx`: the HTML content sections.
- `public/ava/`: character sprites (16 poses), portrait and expression avatars.

## Development

```bash
npm install
npm run dev
npm run build
```
