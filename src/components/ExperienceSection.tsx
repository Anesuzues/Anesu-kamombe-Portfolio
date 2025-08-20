import { motion } from "framer-motion"
import { Calendar, MapPin, Shield, Code, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    title: "Cybersecurity Analyst",
    company: "TechSecure Solutions",
    location: "Remote",
    period: "2023 - Present",
    type: "Full-time",
    description: "Leading threat analysis and vulnerability assessments for enterprise clients. Implemented security protocols that reduced security incidents by 25%.",
    achievements: [
      "Conducted 50+ vulnerability assessments",
      "Developed automated security monitoring tools",
      "Reduced false positives by 40% through ML algorithms"
    ],
    technologies: ["Python", "SIEM Tools", "Azure Security", "Nessus", "Wireshark"]
  },
  {
    title: "Full-Stack Developer",
    company: "Digital Innovation Labs",
    location: "Harare, Zimbabwe",
    period: "2022 - 2023",
    type: "Contract",
    description: "Developed secure web applications with focus on data protection and user privacy. Collaborated with security teams to implement best practices.",
    achievements: [
      "Built 10+ secure web applications",
      "Implemented OAuth 2.0 authentication systems",
      "Achieved 95% code coverage in security testing"
    ],
    technologies: ["React", "Node.js", "MongoDB", "JWT", "Docker"]
  },
  {
    title: "IT Security Intern",
    company: "CyberGuard Africa",
    location: "Harare, Zimbabwe",
    period: "2021 - 2022",
    type: "Internship",
    description: "Assisted in network security monitoring and incident response. Gained hands-on experience with enterprise security tools and frameworks.",
    achievements: [
      "Monitored network traffic for 500+ endpoints",
      "Participated in 20+ incident response activities",
      "Created security awareness training materials"
    ],
    technologies: ["Splunk", "Nmap", "Metasploit", "Kali Linux", "OSINT Tools"]
  }
]

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Zimbabwe",
    location: "Harare, Zimbabwe",
    period: "2019 - 2023",
    grade: "First Class Honours",
    focus: "Cybersecurity & Software Engineering"
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
              <Card className="terminal-border hover:cyber-glow transition-all">
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
            <Card key={index} className="terminal-border hover:cyber-glow transition-all">
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
          ))}
        </motion.div>
      </div>
    </section>
  )
}