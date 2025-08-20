import { motion } from "framer-motion"
import { Shield, Code, Cloud, BarChart3, Server, Lock, Search, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const skillCategories = [
  {
    title: "Cybersecurity",
    icon: Shield,
    color: "text-primary",
    skills: [
      { name: "Ethical Hacking", level: 95 },
      { name: "Threat Analysis", level: 90 },
      { name: "OSINT", level: 88 },
      { name: "CISA Compliance", level: 85 },
      { name: "Python Security Scripts", level: 92 },
      { name: "Vulnerability Assessment", level: 87 }
    ]
  },
  {
    title: "Development",
    icon: Code,
    color: "text-secondary",
    skills: [
      { name: "React", level: 95 },
      { name: "Node.js", level: 90 },
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 88 },
      { name: "HTML/CSS", level: 95 },
      { name: "Java", level: 85 }
    ]
  },
  {
    title: "Cloud Security",
    icon: Cloud,
    color: "text-accent",
    skills: [
      { name: "AWS", level: 82 },
      { name: "Azure", level: 88 },
      { name: "GCP", level: 78 },
      { name: "Microsoft Azure AI", level: 90 },
      { name: "Cloud Compliance", level: 85 }
    ]
  },
  {
    title: "Data Analytics",
    icon: BarChart3,
    color: "text-warning",
    skills: [
      { name: "Tableau", level: 90 },
      { name: "Power BI", level: 88 },
      { name: "Data Visualization", level: 92 },
      { name: "SQL", level: 85 },
      { name: "Python Data Analysis", level: 87 }
    ]
  }
]

const achievements = [
  {
    icon: Lock,
    title: "10+ Vulnerabilities",
    subtitle: "Successfully remediated",
    color: "text-primary"
  },
  {
    icon: Code,
    title: "500+ Lines/Week",
    subtitle: "Code review coverage",
    color: "text-secondary"
  },
  {
    icon: Shield,
    title: "25% Risk Reduction",
    subtitle: "Security improvements",
    color: "text-accent"
  },
  {
    icon: Search,
    title: "95% Coverage",
    subtitle: "Code quality achieved",
    color: "text-warning"
  }
]

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
            Specialized in cybersecurity, full-stack development, and cloud technologies 
            with a focus on building secure, scalable solutions.
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {achievements.map((achievement, index) => (
            <Card key={index} className="terminal-border hover:cyber-glow transition-all text-center">
              <CardContent className="p-6">
                <achievement.icon className={`h-8 w-8 mx-auto mb-3 ${achievement.color}`} />
                <div className="text-2xl font-bold mb-1">{achievement.title}</div>
                <div className="text-sm text-muted-foreground">{achievement.subtitle}</div>
              </CardContent>
            </Card>
          ))}
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
              <Card className="terminal-border hover:cyber-glow transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    <span className="text-xl font-bold">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, width: 0 }}
                      whileInView={{ opacity: 1, width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.8, 
                        delay: categoryIndex * 0.1 + skillIndex * 0.05 
                      }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.level}%
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 1, 
                            delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.2 
                          }}
                          className={`h-2 rounded-full bg-gradient-cyber cyber-glow`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
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
              "Microsoft Azure AI Essentials",
              "IBM Cybersecurity Fundamentals", 
              "CISCO Network Security",
              "OSINT Tactics & Analysis",
              "Tableau Data Visualization"
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