export type PoseName =
  | "idle" | "pacing" | "waving" | "pointing" | "coffee" | "water" | "stretch" | "shrug"
  | "walk0" | "walk1" | "walk2" | "walk3" | "walk4"
  | "sitting" | "reading" | "thinking" | "facepalm" | "celebrate" | "yawn" | "dance" | "sleep";

export type FaceName =
  | "neutral" | "happy" | "sarcasm" | "thinking" | "surprised" | "disappointed" | "excited";

export interface SectionDef {
  id: string;
  label: string;
  /** Which side of the stage the character stands on (desktop). */
  side: "left" | "right";
  pose: PoseName;
  face: FaceName;
  quip: string;
  accent: string;
}

export const sections: SectionDef[] = [
  { id: "home", label: "Home", side: "right", pose: "waving", face: "happy", accent: "#d9a441",
    quip: "Hey, I'm Anesu. Scroll and I'll walk you through it." },
  { id: "about", label: "About", side: "left", pose: "pacing", face: "sarcasm", accent: "#c0703a",
    quip: "Yes, the suit is always this sharp." },
  { id: "skills", label: "Skills", side: "right", pose: "thinking", face: "thinking", accent: "#1aa3a8",
    quip: "Hmm… which stack breaks the least today?" },
  { id: "experience", label: "Experience", side: "left", pose: "sitting", face: "neutral", accent: "#d9a441",
    quip: "Pull up a chair. This is where I've been busy." },
  { id: "projects", label: "Projects", side: "right", pose: "pointing", face: "excited", accent: "#1aa3a8",
    quip: "These ones actually made it to production." },
  { id: "credentials", label: "Credentials", side: "left", pose: "reading", face: "surprised", accent: "#c0703a",
    quip: "Still reading. Still collecting badges." },
  { id: "contact", label: "Contact", side: "right", pose: "celebrate", face: "excited", accent: "#d9a441",
    quip: "You made it! Now send that email." },
];

export const reactions = {
  tooManyClicks: "Okay, okay. I'm not a button.",
  asleep: "Zzz…",
  wake: "I was resting my eyes.",
  cv: "Go on, download it. It's a good read.",
  email: "Yes! That one. Click that one.",
};

export const clickQuips = [
  "Careful, the suit is dry-clean only.",
  "You click, I dance. That's the deal.",
  "Focus. Execute. Repeat.",
  "I'd rather be shipping, but sure.",
  "Hire me and I'll do this in production.",
];

export const profile = {
  name: "Anesu Kamombe",
  role: "Head of Technology",
  company: "NobzTech",
  tagline:
    "I build AI-powered platforms, automation pipelines and secure cloud infrastructure, and ship them to production for SMEs across South Africa.",
  location: "Midrand / Cape Town, South Africa",
  availability: "Open to relocation & remote",
  email: "anesukamombe8@gmail.com",
  phone: "+27 71 750 9324",
  phoneHref: "tel:+27717509324",
  linkedin: "https://linkedin.com/in/anesu-kamombe-ab0667211",
  github: "https://github.com/Anesuzues",
  cv: "/Anesu_Kamombe_CV.pdf",
};

export const stats = [
  { value: "47+", label: "Digital projects led" },
  { value: "5", label: "AI systems in production" },
  { value: "20+", label: "Professional credentials" },
  { value: "25+", label: "Graduates placed" },
];

export const summary = [
  "Head of Technology at NobzTech, delivering AI-powered platforms, automation pipelines and secure cloud infrastructure for SME clients across South Africa.",
  "Aviatrix ACE-certified in multicloud networking, with production LLM/RAG deployments, full-stack engineering and an offensive-security mindset.",
  "Experienced leading cross-functional delivery, mentoring graduate developers, and shipping concurrently across multiple client engagements.",
];

export const highlights = [
  "Aviatrix ACE Multicloud",
  "Azure AI Essentials",
  "AWS AI Practitioner",
  "BSc Computer Science (UNISA)",
];

export const skillGroups = [
  { title: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "Bash"] },
  { title: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui", "React Native"] },
  { title: "Backend", items: ["Node.js", "FastAPI", "REST APIs", "CI/CD", "Docker", "Git"] },
  { title: "Cloud", items: ["AWS", "Azure", "GCP", "Terraform", "Supabase", "Vercel", "cPanel"] },
  { title: "Data / AI", items: ["PostgreSQL", "RAG Architectures", "LLM Development", "Ollama", "Firebase"] },
  { title: "Security", items: ["Zero-Trust", "SIEM", "OSINT", "Ethical Hacking", "NIST / CIS"] },
];

export const experience = [
  {
    role: "Head of Technology",
    type: "Contract",
    company: "NobzTech",
    place: "Midrand, SA",
    period: "Oct 2025 – Present",
    points: [
      "Lead technical architecture and delivery across 47+ digital projects spanning AI, automation, CRM, eCommerce and cloud.",
      "Design and deploy AI-powered solutions: chatbot workflows, payment-enabled platforms and operational tools.",
      "Oversee cloud infrastructure, DevOps and CI/CD; drive cybersecurity posture across client-facing and internal systems.",
      "Mentored WIL interns and junior developers, contributing to 25+ graduates placed into the workplace pipeline.",
      "Designed and delivered a 4-week Cybersecurity Upskilling Programme (Linux, network & web app security, incident response).",
    ],
  },
  {
    role: "Software Developer",
    type: "Contract, part-time",
    company: "Spane4All",
    place: "",
    period: "Jun – Dec 2025",
    points: [
      "Developed and tested 5+ applications within an Agile team, contributing directly to production codebases.",
      "Resolved 10+ complex issues alongside senior developers, cutting debugging time ~15%; 95% unit test coverage on delivered modules.",
    ],
  },
  {
    role: "Accelerator Intern",
    type: "",
    company: "Sunderland Internacional",
    place: "Cape Town",
    period: "May – Jun 2025",
    points: [
      "Compiled 500+ prospect records, increasing lead generation by 15%; built 5 Tableau visualisations supporting client-retention insights.",
    ],
  },
];

export const projects = [
  {
    name: "JARVIS",
    quip: "Thirty-five agents. I only argue with some of them.",
    subtitle: "AI Orchestration Platform",
    period: "2025 – Present",
    description:
      "Personal AI orchestration platform integrating 5 AI systems with 35+ specialist agents, intelligent task routing, a 5-layer memory architecture and hybrid local/cloud inference via Ollama.",
    stack: ["Python", "Node.js", "Rust", "Supabase", "Ollama"],
    link: "https://github.com/Anesuzues",
    linkLabel: "GitHub",
  },
  {
    name: "TenderPilot AI",
    quip: "Tenders, minus the weekend of paperwork.",
    subtitle: "Tender management for SA SMEs",
    period: "2025",
    description:
      "Covers the full journey from RFP analysis to submission-ready proposals. Full RAG pipeline with compliance vault, proposal builder and matching engine; B-BBEE/POPIA compliant with RBAC and tenant isolation.",
    stack: ["FastAPI", "React", "PostgreSQL", "pgvector", "Claude", "Supabase"],
    link: "https://tender-pilot-seven.vercel.app",
    linkLabel: "Live site",
  },
  {
    name: "SYNTRA Financial Pro",
    quip: "Four AI coaches judging your spending. Gently.",
    subtitle: "Cross-platform fintech app",
    period: "2025",
    description:
      "iOS, Android and web app with 4 AI coaches, 87% accurate 30-day cash-flow forecasting and spending anomaly detection, built for the South African market with POPIA compliance.",
    stack: ["React Native", "Expo", "TypeScript", "Firebase", "Gemini", "Genkit"],
    link: "https://github.com/Anesuzues/SYNTRA-APP",
    linkLabel: "GitHub",
  },
  {
    name: "PoolPal",
    quip: "Stokvels, without the WhatsApp chaos.",
    subtitle: "Group savings platform",
    period: "2025",
    description:
      "Mobile-first web app automating stokvel and group savings with Paystack integration, democratic voting, CSV export for accountability and WhatsApp notifications.",
    stack: ["React 18", "TypeScript", "Paystack", "WhatsApp API", "shadcn/ui"],
    link: "https://github.com/Anesuzues/poolpal-your-group-s-money-buddy",
    linkLabel: "GitHub",
  },
];

export const education = {
  degree: "Bachelor of Science in Computer Science",
  school: "University of South Africa (UNISA)",
  period: "Completed Nov 2024",
  modules: [
    "Data Structures & Algorithms", "Software Engineering", "Database Systems", "Computer Networks",
    "Information Security", "Artificial Intelligence", "Software Project Management",
  ],
};

export const certifications = [
  {
    year: "2026",
    items: [
      "Game Hacking Fundamentals (Red Team Leaders)",
      "AWS AI Practitioner Challenge (Udacity / Accenture)",
      "cPanel Professional",
      "Claude Code in Action (Anthropic)",
      "Claude 101 (Anthropic)",
    ],
  },
  {
    year: "2025",
    items: [
      "Aviatrix ACE Multicloud Network Associate",
      "Architecting LLM Apps on Azure: RAG & Agents (Udemy)",
      "Azure AI Essentials Professional (Microsoft / LinkedIn)",
      "Intro to OSINT (Security Blue Team)",
      "Cybersecurity Fundamentals (IBM)",
      "Intro to Cybersecurity (Cisco)",
      "Cloud Security & Audit Fundamentals (CompTIA)",
      "JavaScript Essentials 1 (Cisco)",
    ],
  },
];

/**
 * Pixel sizes of the cut-out sprites in /public/ava. `ax` is the horizontal anchor
 * (head centre, 0..1) used to keep the walk frames from jittering.
 */
export const spriteSizes: Record<PoseName, { w: number; h: number; ax?: number }> = {
  idle: { w: 316, h: 949 },
  pacing: { w: 267, h: 950 },
  waving: { w: 345, h: 959 },
  pointing: { w: 405, h: 954 },
  coffee: { w: 386, h: 959 },
  water: { w: 422, h: 951 },
  stretch: { w: 407, h: 971 },
  shrug: { w: 498, h: 954 },
  sitting: { w: 435, h: 624 },
  reading: { w: 373, h: 598 },
  thinking: { w: 341, h: 616 },
  facepalm: { w: 348, h: 618 },
  celebrate: { w: 377, h: 622 },
  yawn: { w: 320, h: 627 },
  dance: { w: 358, h: 622 },
  sleep: { w: 364, h: 633 },
  walk0: { w: 435, h: 956, ax: 0.453 },
  walk1: { w: 293, h: 946, ax: 0.585 },
  walk2: { w: 267, h: 962, ax: 0.584 },
  walk3: { w: 409, h: 961, ax: 0.516 },
  walk4: { w: 293, h: 945, ax: 0.582 },
};

/** Side-view walk cycle, facing right. */
export const walkCycle: PoseName[] = ["walk0", "walk1", "walk2", "walk3", "walk4", "walk2"];
