import { ContactSection } from "@/components/ContactSection"
import { MatrixBackground } from "@/components/MatrixBackground"

const Contact = () => {
  return (
    <main className="min-h-screen relative">
      <MatrixBackground />
      <div className="relative z-10">
        <ContactSection />
      </div>
    </main>
  )
}

export default Contact