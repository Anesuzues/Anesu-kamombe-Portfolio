import { Shield, Code, User, Mail, Github, Linkedin, Terminal, Database } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { scrollToSection, useActiveSection, pathForSection, type SectionId } from "@/lib/sections"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems: { title: string; icon: typeof User; section: SectionId }[] = [
  { title: "Profile", icon: User, section: "about" },
  { title: "Skills", icon: Code, section: "skills" },
  { title: "Projects", icon: Terminal, section: "projects" },
  { title: "Experience", icon: Database, section: "experience" },
  { title: "Contact", icon: Mail, section: "contact" },
]

const socialLinks = [
  { title: "GitHub", icon: Github, url: "https://github.com/Anesuzues" },
  { title: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/anesu-kamombe-ab0667211/" },
]

export function CyberSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const active = useActiveSection()
  const navigate = useNavigate()
  // On mobile the sidebar is a drawer, so labels are always shown.
  const showLabels = state === "expanded" || isMobile

  return (
    <Sidebar className="border-r border-primary/20 bg-card/50 backdrop-blur-md">
      <SidebarHeader className="border-b border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          {showLabels && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-glow">Anesu Kamombe</h2>
              <p className="text-xs text-muted-foreground">Head of Technology · AI Systems</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-glow">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = active === item.section
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} className="group hover:cyber-glow">
                      <a
                        href={pathForSection(item.section)}
                        aria-current={isActive ? "location" : undefined}
                        onClick={(e) => {
                          e.preventDefault()
                          // Off the main page (e.g. 404) there is nothing to scroll to — route there instead.
                          if (document.getElementById(item.section)) scrollToSection(item.section)
                          else navigate(pathForSection(item.section))
                          if (isMobile) setOpenMobile(false)
                        }}
                        className={`flex items-center gap-3 transition-colors ${
                          isActive
                            ? "bg-primary/20 text-primary border-l-2 border-primary"
                            : "hover:bg-primary/10 text-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                        {showLabels && <span className="font-medium">{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-primary/20 p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {socialLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild className="hover:cyber-glow">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                    >
                      <link.icon className="h-4 w-4" />
                      {showLabels && <span>{link.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
