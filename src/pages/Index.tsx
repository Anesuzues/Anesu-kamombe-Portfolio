import { HeroSection } from "@/components/HeroSection"
import { SkillsSection } from "@/components/SkillsSection"
import { MatrixBackground } from "@/components/MatrixBackground"

const Index = () => {
  return (
    <main className="min-h-screen relative">
      <MatrixBackground />
      <div className="relative z-10">
        <HeroSection />
        <SkillsSection />
      </div>
    </main>
  )
}

export default Index