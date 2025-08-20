import { ProjectsSection } from "@/components/ProjectsSection"
import { MatrixBackground } from "@/components/MatrixBackground"

const Projects = () => {
  return (
    <main className="min-h-screen relative">
      <MatrixBackground />
      <div className="relative z-10">
        <ProjectsSection />
      </div>
    </main>
  )
}

export default Projects