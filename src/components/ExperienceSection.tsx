import { motion } from "framer-motion"
import { Calendar, MapPin, Shield, Code, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TiltCard } from "@/components/TiltCard"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    title: "Head of Technology (Contract)",
    company: "NobzTech",
    location: "Midrand, SA",
    period: "Oct 2025 - Present",
    type: "Contract",
    description: "Digital transformation & AI solutions company helping SA SMEs scale through custom platforms, automation, and AI.",
    achievements: [
      "Lead technical architecture, delivery, and engineering decisions across 47+ digital projects covering AI, automation, CRM, eCommerce, and cloud solutions",
      "Design and deploy AI-powered solutions — chatbot workflows, payment-enabled platforms, and operational tools — directly supporting client digital transformation",
      "Oversee cloud infrastructure, DevOps, and CI/CD pipelines; drive cybersecurity posture across all client-facing and internal systems",
      "Managed and mentored a cohort of WIL interns and junior developers, contributing to 25+ graduates placed into the workplace pipeline",
      "Designed and delivered a 4-week Cybersecurity Upskilling Programme covering Linux, network security, web app security, and incident response"
    ],
    technologies: ["AI/LLM Systems", "Automation", "Cloud Infrastructure", "DevOps", "CI/CD", "Cybersecurity", "Team Leadership"]
  },
  {
    title: "Software Developer (Contract)",
    company: "Spane4All",
    location: "Remote",
    period: "Jun 2025 - Dec 2025",
    type: "Contract · Part-time, concurrent with NobzTech",
    description: "Developed and tested software applications across utilities and medium-sized modules within an Agile team, contributing directly to production codebases.",
    achievements: [
      "Developed and tested 5+ applications across utilities and medium-sized modules within an Agile team",
      "Resolved 10+ complex issues alongside senior developers, reducing debugging time by ~15%",
      "Achieved 95% unit test coverage on all delivered modules"
    ],
    technologies: ["React", "Node.js", "JavaScript", "TypeScript", "Git", "Docker", "REST APIs", "Unit Testing"]
  },
  {
    title: "Accelerator Intern",
    company: "Sunderland Internacional",
    location: "Cape Town, SA",
    period: "May 2025 - Jun 2025",
    type: "Internship",
    description: "Supported client outreach and retention initiatives through prospect research and data visualization.",
    achievements: [
      "Compiled 500+ prospect records, increasing lead generation by 15%",
      "Built 5 Tableau visualisations supporting client retention insights"
    ],
    technologies: ["Tableau", "Data Analysis", "Client Research"]
  }
]

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of South Africa (UNISA)",
    location: "South Africa",
    period: "Completed Nov 2024",
    grade: "Completed",
    focus: "Data Structures & Algorithms · Software Engineering · Database Systems · Computer Networks · Information Security · Artificial Intelligence · Software Project Management",
  }
]

export function ExperienceSection() {
  return (
    <section className="py-20 px-6" data-section="experience">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-glow">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building secure systems and analyzing threats across diverse technology environments.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-8 mb-16">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <TiltCard max={3}>
              <Card className="terminal-border hover:cyber-glow transition-all bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {exp.title}
                      </CardTitle>
                      <div className="text-lg text-primary font-semibold">{exp.company}</div>
                    </div>
                    <div className="flex flex-col lg:items-end gap-2">
                      <Badge variant="outline" className="w-fit">
                        {exp.type}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {exp.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{exp.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      Key Achievements
                    </h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4 text-secondary" />
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-glow text-center">Education</h3>
          {education.map((edu, index) => (
            <TiltCard key={index} max={4}>
            <Card className="terminal-border hover:cyber-glow transition-all bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold">{edu.degree}</h4>
                    <div className="text-lg text-primary font-semibold">{edu.institution}</div>
                    <div className="text-sm text-muted-foreground">{edu.focus}</div>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <Badge className="bg-gradient-cyber w-fit">
                      {edu.grade}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {edu.period}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {edu.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  )
}