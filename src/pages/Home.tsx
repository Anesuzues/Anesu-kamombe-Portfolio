import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { HeroSection } from "@/components/HeroSection"
import { SkillsSection } from "@/components/SkillsSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { ExperienceSection } from "@/components/ExperienceSection"
import { ContactSection } from "@/components/ContactSection"
import { SECTIONS, pathForSection, scrollToSection, sectionForPath, setActiveSection, type SectionId } from "@/lib/sections"

const Home = () => {
  const { pathname } = useLocation()

  // Deep links (/projects, /contact, …) land on their section.
  useEffect(() => {
    const id = sectionForPath(pathname)
    if (id === "about") {
      window.scrollTo(0, 0)
      setActiveSection("about")
    } else {
      // Wait a frame so the sections have laid out.
      requestAnimationFrame(() => scrollToSection(id, false))
    }
  }, [pathname])

  // Track which section is on screen: highlights the sidebar, recolours the 3D scene, updates the URL.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const id = visible.target.id as SectionId
        setActiveSection(id)
        const path = pathForSection(id)
        if (window.location.pathname !== path) window.history.replaceState(null, "", path)
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <main className="relative z-10">
      <div id="about" className="scroll-mt-0">
        <HeroSection />
      </div>
      <div id="skills" className="scroll-mt-4">
        <SkillsSection />
      </div>
      <div id="projects" className="scroll-mt-4">
        <ProjectsSection />
      </div>
      <div id="experience" className="scroll-mt-4">
        <ExperienceSection />
      </div>
      <div id="contact" className="scroll-mt-4">
        <ContactSection />
      </div>
    </main>
  )
}

export default Home
