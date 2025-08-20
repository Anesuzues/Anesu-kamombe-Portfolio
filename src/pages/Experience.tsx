import { ExperienceSection } from "@/components/ExperienceSection"
import { MatrixBackground } from "@/components/MatrixBackground"

const Experience = () => {
  return (
    <main className="min-h-screen relative">
      <MatrixBackground />
      <div className="relative z-10">
        <ExperienceSection />
      </div>
    </main>
  )
}

export default Experience