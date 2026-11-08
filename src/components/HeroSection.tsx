import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Shield, Download, ExternalLink, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { scrollToSection } from "@/lib/sections"

const CyberGlobe = lazy(() =>
  import("@/components/3d/CyberGlobe").then((m) => ({ default: m.CyberGlobe }))
)

const titles = [
  "Head of Technology",
  "AI Systems Architect",
  "Full-Stack Developer",
  "Cybersecurity Specialist"
]

export function HeroSection() {
  const [currentTitle, setCurrentTitle] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100
    const currentFullText = titles[currentTitle]
    
    const timer = setTimeout(() => {
      if (!isDeleting && displayedText !== currentFullText) {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1))
      } else if (isDeleting && displayedText !== "") {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1))
      } else if (!isDeleting && displayedText === currentFullText) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false)
        setCurrentTitle((prev) => (prev + 1) % titles.length)
      }
    }, typeSpeed)

    return () => clearTimeout(timer)
  }, [displayedText, isDeleting, currentTitle])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle grid over the global 3D scene */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Name and Title */}
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold text-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Anesu 
              <span className="text-primary"> Kamombe</span>
            </motion.h1>
            
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-primary animate-pulse-glow" />
              <div className="text-2xl lg:text-3xl font-semibold h-12 flex items-center">
                <span className="text-accent">{displayedText}</span>
                <span className="animate-blink text-primary">|</span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <motion.p 
            className="text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-primary">Secure Systems.</span>{" "}
            <span className="text-secondary">Build AI Platforms.</span>{" "}
            <span className="text-accent">Analyze Threats.</span>
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center terminal-border rounded-lg p-4 hover:cyber-glow transition-all">
              <div className="text-3xl font-bold text-primary">47+</div>
              <div className="text-sm text-muted-foreground">Digital Projects</div>
            </div>
            <div className="text-center terminal-border rounded-lg p-4 hover:cyber-glow transition-all">
              <div className="text-3xl font-bold text-accent">5</div>
              <div className="text-sm text-muted-foreground">AI Systems Live</div>
            </div>
            <div className="text-center terminal-border rounded-lg p-4 hover:cyber-glow transition-all">
              <div className="text-3xl font-bold text-secondary">25+</div>
              <div className="text-sm text-muted-foreground">Devs Mentored</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              size="lg"
              className="bg-gradient-cyber hover:scale-105 transition-all shadow-cyber"
              onClick={() => scrollToSection("projects")}
            >
              <Shield className="mr-2 h-5 w-5" />
              View Security Projects
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary/50 hover:bg-primary/10 hover:scale-105 transition-all"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Anesu Kamombe resume.pdf';
                link.download = 'Anesu Kamombe resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Content - 3D Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[420px] sm:h-[520px] lg:h-[700px]"
        >
          {/* 3D Globe Container */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
              }
            >
              <CyberGlobe />
            </Suspense>
          </div>
          
          {/* Floating Security Elements */}
          <div className="absolute top-10 right-10 animate-float">
            <div className="terminal-border rounded-lg p-3 bg-card/80 backdrop-blur-sm">
              <div className="text-accent text-sm font-mono">THREAT LEVEL: LOW</div>
              <div className="text-xs text-muted-foreground">All systems secure</div>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-10 animate-float" style={{ animationDelay: '1s' }}>
            <div className="terminal-border rounded-lg p-3 bg-card/80 backdrop-blur-sm">
              <div className="text-primary text-sm font-mono">SCAN STATUS: ACTIVE</div>
              <div className="text-xs text-muted-foreground">Monitoring network</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        type="button"
        onClick={() => scrollToSection("skills")}
        aria-label="Scroll to skills"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block hover:text-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="flex flex-col items-center text-muted-foreground">
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </div>
      </motion.button>
    </section>
  )
}
