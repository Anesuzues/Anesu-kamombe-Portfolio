import { motion } from "framer-motion"
import { ExternalLink, Github, Shield, Code, Database, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    title: "Cybersecurity Threat Analysis Dashboard",
    description: "Real-time threat monitoring system with automated vulnerability scanning and risk assessment capabilities.",
    technologies: ["Python", "React", "Node.js", "MongoDB", "Azure"],
    category: "Security",
    icon: Shield,
    color: "text-primary",
    github: "#",
    demo: "#"
  },
  {
    title: "OSINT Investigation Platform",
    description: "Comprehensive open-source intelligence gathering tool for digital forensics and threat intelligence.",
    technologies: ["Python", "JavaScript", "PostgreSQL", "Docker"],
    category: "Intelligence",
    icon: Database,
    color: "text-accent",
    github: "#",
    demo: "#"
  },
  {
    title: "Cloud Security Compliance Checker",
    description: "Automated cloud infrastructure security assessment tool for AWS, Azure, and GCP environments.",
    technologies: ["Python", "AWS SDK", "Azure CLI", "Terraform"],
    category: "Cloud Security",
    icon: Cloud,
    color: "text-secondary",
    github: "#",
    demo: "#"
  },
  {
    title: "Vulnerability Management System",
    description: "Enterprise-grade vulnerability tracking and remediation platform with automated reporting.",
    technologies: ["Java", "Spring Boot", "React", "MySQL"],
    category: "Security",
    icon: Code,
    color: "text-warning",
    github: "#",
    demo: "#"
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
            Security <span className="text-primary">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing cybersecurity solutions, threat analysis tools, and secure application development projects.
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
              <Card className="terminal-border hover:cyber-glow transition-all h-full">
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
                    <Button
                      size="sm"
                      className="bg-gradient-cyber hover:scale-105 transition-all"
                      onClick={() => window.open(project.demo, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}