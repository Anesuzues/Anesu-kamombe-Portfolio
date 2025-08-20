import { SkillsSection } from "@/components/SkillsSection"
import { MatrixBackground } from "@/components/MatrixBackground"

const Skills = () => {
  return (
    <main className="min-h-screen relative">
      <MatrixBackground />
      <div className="relative z-10">
        <SkillsSection />
      </div>
    </main>
  )
}

export default Skills