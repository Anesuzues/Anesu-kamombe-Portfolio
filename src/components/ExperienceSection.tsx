import { motion } from "framer-motion"
import { Calendar, MapPin, Shield, Code, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const experiences = [
  {
    title: "Power Platform Developer (Trainee)",
    company: "Microsoft Power Up Program",
    location: "Remote",
    period: "September 2025 - Present",
    type: "Training Program",
    description: "Selected for a competitive, intensive training program sponsored by Microsoft focused on mastering the Power Platform suite (Power Apps, Power Automate, Power BI, Power Pages).",
    achievements: [
      "Developing scalable canvas and model-driven Power Apps to solve real-world business problems, improving data collection and workflow efficiency by an estimated 40%",
      "Automating complex, repetitive business processes by building cloud flows with Power Automate, integrating with Microsoft 365 and third-party services to reduce manual effort",
      "Transforming raw data into actionable insights by building interactive dashboards and reports in Power BI, enabling data-driven decision-making",
      "Applying best practices for solution design, data modeling, and user experience (UX) within the Power Platform ecosystem"
    ],
    technologies: ["Power Apps", "Power Automate", "Power BI", "Power Pages", "Microsoft 365", "Data Modeling"]
  },
  {
    title: "Software Developer Intern",
    company: "Spane4All",
    location: "Remote",
    period: "06/2025 - Present",
    type: "Internship",
    description: "Developed and tested software applications while collaborating with senior developers to troubleshoot complex issues and maintain high code quality standards.",
    achievements: [
      "Developed and tested at least 5+ software applications, ranging in size from small utilities to medium-sized modules",
      "Collaborated with senior developers to troubleshoot and debug over 10 complex issues, reducing debugging time by an estimated 15%",
      "Conducted unit tests and documented test results, achieving 95% code coverage for quality assurance",
      "Wrote clean, maintainable code following industry best practices, resulting in a 10% reduction in code complexity",
      "Contributed at least 3 ideas for project enhancements during team meetings, 2 of which were implemented and resulted in measurable improvements",
      "Participated in code reviews and provided valuable feedback for improvements, reviewing an average of 500 lines of code per week"
    ],
    technologies: ["React", "Node.js", "JavaScript", "TypeScript", "HTML", "CSS", "MongoDB", "PostgreSQL", "Express.js", "Git", "Docker", "REST APIs", "Unit Testing", "Code Review"]
  },
  {
    title: "Accelerator Intern",
    company: "Sunderland Internacional",
    location: "Cape Town",
    period: "05/2025 - 07/2025",
    type: "Internship",
    description: "Compiled databases and managed client outreach initiatives, improving lead generation and client engagement through data analysis and visualization.",
    achievements: [
      "Compiled a database of 500 prospective clients through research, resulting in a 15% increase in lead generation",
      "Researched and compiled a database of 350+ prospective clients, improving the efficiency of targeted outreach by 20%",
      "Managed and organized 200 documents, improving information retrieval efficiency by 30%",
      "Spearheaded 5 data visualizations in Tableau, providing actionable insights that improved client retention by 8%",
      "Improved client participation by 15% and overall engagement by 10% through the implementation of 3 client feedback surveys"
    ],
    technologies: ["Tableau", "Data Analysis", "Database Management", "Client Research"]
  },
  {
    title: "Cybersecurity Virtual Experience Program on Forage ",
    company: " AIG Shields Up",
    location: "Remote",
    period: " May 2025 - July 2025",
    type: "Internship",
    description: "Assisted in network security monitoring and incident response. Gained hands-on experience with enterprise security tools and frameworks.",
    achievements: [
" Led 12 cybersecurity threat analysis simulations, identifying and mitigating an average of 5 critical vulnerabilities per simulation.",
"Monitored CISA publications daily, alerting teams to 3 emerging high-severity threats and enabling security updates.",
"Analyzed and remediated over 50+ vulnerabilities, reducing the company's overall risk score by 25%.",
"Advised 5 teams on vulnerability remediation strategies, improving their average remediation time by 15%",
"Automated Python script detects 10 common web vulnerabilities, saving the ethical hacking team 20 hours weekly",
"Conducted cybersecurity research, publishing 2 white papers on emerging threats and presenting findings at 1 industry conference",

],
    technologies: ["Splunk", "Nmap", "Metasploit", "Kali Linux", "OSINT Tools","Python"]
  }
]

const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "University of South Africa",
    location: "Pretoria, South Africa",
    period: "2022 - 2024",
    grade: "First Class Honours",
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