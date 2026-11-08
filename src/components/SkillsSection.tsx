import { lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Shield, Code, Cloud, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TiltCard } from "@/components/TiltCard"

const SkillSphere = lazy(() => import("@/components/3d/SkillSphere"))

const skillCategories = [
  {
    title: "AI & Data",
    icon: BarChart3,
    color: "text-primary",
    hex: "#00ffff",
    skills: [
      "RAG Architectures",
      "LLM Development (Claude, Gemini)",
      "Python",
      "PostgreSQL / pgvector",
      "Ollama (Local Inference)"
    ]
  },
  {
    title: "Development",
    icon: Code,
    color: "text-secondary",
    hex: "#4d7cff",
    skills: [
      "React / Next.js",
      "TypeScript",
      "Node.js / FastAPI",
      "React Native",
      "Java"
    ]
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "text-accent",
    hex: "#00ff66",
    skills: [
      "AWS",
      "Azure",
      "GCP",
      "Terraform",
      "Docker / CI/CD"
    ]
  },
  {
    title: "Security",
    icon: Shield,
    color: "text-warning",
    hex: "#ffc400",
    skills: [
      "Ethical Hacking",
      "OSINT",
      "Zero-Trust / SIEM",
      "NIST / CIS Frameworks",
      "Making & Deploying RAG Agents"
    ]
  }
]

const sphereSkills = skillCategories.flatMap((c) =>
  c.skills.map((label) => ({ label, color: c.hex }))
)

export function SkillsSection() {
  return (
    <section className="py-20 px-6" data-section="skills">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-glow">
            Technical <span className="text-primary">Expertise</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Specialized in AI/RAG systems, full-stack development, and cloud infrastructure
            with a security-first engineering background.
          </p>
        </motion.div>

        {/* 3D Skill Sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mb-16 h-[380px] sm:h-[460px] lg:h-[520px]"
        >
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="h-24 w-24 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </div>
            }
          >
            <SkillSphere skills={sphereSkills} />
          </Suspense>
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground">
            drag to rotate the skill graph
          </p>
        </motion.div>

        {/* Skills Categories */}
        <div className="grid lg:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: categoryIndex % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            >
              <TiltCard>
              <Card className="terminal-border hover:cyber-glow transition-all bg-card/80 backdrop-blur-sm h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    <span className="text-xl font-bold">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05
                        }}
                      >
                        <Badge
                          variant="outline"
                          className="text-sm py-1.5 px-3 hover:cyber-glow hover:border-primary/60 transition-all"
                        >
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-glow">Professional Certifications</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Aviatrix ACE Multicloud Network Associate",
              "AWS AI Practitioner (Udacity/Accenture)",
              "Azure AI Essentials Professional",
              "Architecting LLM Apps on Azure: RAG & Agents",
              "IBM Cybersecurity Fundamentals",
              "OSINT Fundamentals (Security Blue Team)"
            ].map((cert, index) => (
              <Badge 
                key={cert}
                className="security-badge text-sm py-2 px-4 hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {cert}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
