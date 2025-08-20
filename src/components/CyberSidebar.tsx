import { useState } from "react"
import { Shield, Code, Cloud, BarChart3, User, Mail, Github, Linkedin, Terminal, Database } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

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

const navigationItems = [
  { title: "Profile", url: "/", icon: User, section: "about" },
  { title: "Skills", url: "/skills", icon: Code, section: "skills" },
  { title: "Projects", url: "/projects", icon: Terminal, section: "projects" },
  { title: "Experience", url: "/experience", icon: Database, section: "experience" },
  { title: "Contact", url: "/contact", icon: Mail, section: "contact" },
]

const securityTools = [
  { title: "Threat Analysis", icon: Shield },
  { title: "Vulnerability Scanner", icon: Terminal },
  { title: "OSINT Tools", icon: Database },
  { title: "Cloud Security", icon: Cloud },
]

const socialLinks = [
  { title: "GitHub", icon: Github, url: "https://github.com" },
  { title: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
]

export function CyberSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const isExpanded = navigationItems.some((item) => isActive(item.url))

  return (
    <Sidebar className="border-r border-primary/20 bg-card/50 backdrop-blur-md">
      <SidebarHeader className="border-b border-primary/20 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-cyber flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-glow">Anesu Kamombe</h2>
              <p className="text-xs text-muted-foreground">Cybersecurity Specialist</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-glow">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="group hover:cyber-glow"
                  >
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${
                          isActive 
                            ? "bg-primary/20 text-primary border-l-2 border-primary" 
                            : "hover:bg-primary/10 text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                      {state === "expanded" && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-accent text-glow">Security Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityTools.map((tool) => (
                <SidebarMenuItem key={tool.title}>
                  <SidebarMenuButton className="group hover:matrix-glow">
                    <tool.icon className="h-4 w-4 text-accent group-hover:text-accent/80" />
                    {state === "expanded" && (
                      <span className="text-sm text-muted-foreground">{tool.title}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                      {state === "expanded" && <span>{link.title}</span>}
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