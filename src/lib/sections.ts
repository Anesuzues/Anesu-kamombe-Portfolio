import { useSyncExternalStore } from "react"

/** The single-page layout: each section has an anchor id and a shareable URL path. */
export const SECTIONS = [
  { id: "about", path: "/" },
  { id: "skills", path: "/skills" },
  { id: "projects", path: "/projects" },
  { id: "experience", path: "/experience" },
  { id: "contact", path: "/contact" },
] as const

export type SectionId = (typeof SECTIONS)[number]["id"]

export const sectionForPath = (path: string): SectionId => {
  const clean = path.replace(/\/+$/, "") || "/"
  return SECTIONS.find((s) => s.path === clean)?.id ?? "about"
}

export const pathForSection = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.path

/* ---- active section store (written by the page's scroll observer, read by sidebar + 3D scene) ---- */

let active: SectionId = "about"
const listeners = new Set<() => void>()

export function setActiveSection(id: SectionId) {
  if (id === active) return
  active = id
  listeners.forEach((l) => l())
}

export function useActiveSection() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => active
  )
}

/** Smooth-scroll to a section and keep the URL in sync without a router navigation. */
export function scrollToSection(id: SectionId, smooth = true) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" })
  window.history.replaceState(null, "", pathForSection(id))
  setActiveSection(id)
}
