import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Github, Linkedin, Send, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "anesukamombe8@gmail.com",
    href: "mailto:anesukamombe8@gmail.com",
    color: "text-primary"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+27717509324",
    href: "tel:+27717509324",
    color: "text-secondary"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Cape Town, South Africa",
    href: "#",
    color: "text-accent"
  }
]

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Anesuzues",
    href: "https://github.com/Anesuzues",
    color: "text-primary"
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "www.linkedin.com/in/anesu-kamombe-ab0667211",
    href: "https://www.linkedin.com/in/anesu-kamombe-ab0667211/",
    color: "text-secondary"
  }
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, subject, message } = formData
    const mailtoLink = `mailto:anesukamombe8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`
    window.location.href = mailtoLink
  }

  return (
    <section className="py-20 px-6" data-section="contact">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-glow">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to innovate? Let's connect and build something secure together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Card className="terminal-border hover:cyber-glow transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={contact.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <contact.icon className={`h-5 w-5 ${contact.color}`} />
                    <div>
                      <div className="font-medium">{contact.label}</div>
                      <a 
                        href={contact.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contact.value}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="terminal-border hover:cyber-glow transition-all">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <social.icon className={`h-5 w-5 ${social.color}`} />
                    <div>
                      <div className="font-medium">{social.label}</div>
                      <a 
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {social.value}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="terminal-border hover:cyber-glow transition-all">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input 
                        placeholder="Your name"
                        className="border-primary/20 focus:border-primary"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input 
                        type="email"
                        placeholder="your.email@example.com"
                        className="border-primary/20 focus:border-primary"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input 
                      placeholder="Project inquiry, collaboration, etc."
                      className="border-primary/20 focus:border-primary"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea 
                      placeholder="Tell me about your project or inquiry..."
                      rows={6}
                      className="border-primary/20 focus:border-primary resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-cyber hover:scale-105 transition-all shadow-cyber"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}