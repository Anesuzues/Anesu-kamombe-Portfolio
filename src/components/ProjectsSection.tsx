import { motion } from "framer-motion"
import { ExternalLink, Github, Shield, Code, Database, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TiltCard } from "@/components/TiltCard"

const projects = [
  {
    title: "JARVIS – AI Orchestration Platform",
    description: "Personal AI orchestration platform integrating 5 AI systems with 35+ specialist agents, intelligent task routing, a 5-layer memory architecture, and hybrid local/cloud inference via Ollama for zero-cost private processing.",
    technologies: ["Python", "Node.js", "Rust", "Supabase", "Ollama"],
    category: "AI Orchestration",
    icon: Code,
    color: "text-primary",
    github: "https://github.com/Anesuzues",
    demo: null
  },
  {
    title: "TenderPilot AI",
    description: "AI-powered tender management platform for SA SMEs covering the full journey from RFP analysis to submission-ready proposals — full RAG pipeline with compliance vault, proposal builder, and matching engine; B-BBEE/POPIA compliant with RBAC and tenant isolation.",
    technologies: ["Python", "FastAPI", "React", "PostgreSQL", "pgvector", "Anthropic Claude", "Supabase"],
    category: "AI / RAG Platform",
    icon: Shield,
    color: "text-accent",
    github: "https://github.com/Anesuzues",
    demo: "https://tender-pilot-seven.vercel.app"
  },
  {
    title: "SYNTRA Financial Pro",
    description: "Cross-platform fintech app (iOS/Android/Web) with 4 AI coaches, 87% accurate 30-day cash flow forecasting, and spending anomaly detection built for the South African market with POPIA compliance.",
    technologies: ["React Native", "Expo", "TypeScript", "Firebase", "Google Gemini AI", "Genkit"],
    category: "Fintech",
    icon: Database,
    color: "text-secondary",
    github: "https://github.com/Anesuzues/SYNTRA-APP",
    demo: null
  },
  {
    title: "PoolPal – Group Savings Platform",
    description: "Mobile-first web app automating stokvel and group savings management with Paystack integration, democratic voting, CSV export for accountability, and WhatsApp notifications.",
    technologies: ["React 18", "TypeScript", "Paystack API", "WhatsApp Business API", "shadcn/ui"],
    category: "Fintech",
    icon: Cloud,
    color: "text-warning",
    github: "https://github.com/Anesuzues/poolpal-your-group-s-money-buddy",
    demo: null
  }
]

export function ProjectsSection() {
  return (
    <section className="py-20 px-6" data-section="projects">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-glow">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI orchestration, RAG platforms, and fintech applications built end-to-end — from architecture to production.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <TiltCard>
              <Card className="terminal-border hover:cyber-glow transition-all bg-card/80 backdrop-blur-sm h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <project.icon className={`h-6 w-6 ${project.color}`} />
                      <div>
                        <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/50 hover:bg-primary/10"
                      onClick={() => window.open(project.github, '_blank')}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Button>
                    {project.demo && (
                      <Button
                        size="sm"
                        className="bg-gradient-cyber hover:scale-105 transition-all"
                        onClick={() => window.open(project.demo, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}