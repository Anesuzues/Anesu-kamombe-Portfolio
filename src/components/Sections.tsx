import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowDown, ArrowUpRight, Briefcase, Download, Github, GraduationCap, Linkedin, Mail, MapPin, Phone,
} from "lucide-react";
import { Tilt } from "./Tilt";
import {
  certifications, education, experience, highlights, profile, projects, reactions, sections, skillGroups, stats, summary,
} from "@/data/content";
import { companion } from "@/lib/companion";

const nudgeCv = () => companion.react({ pose: "shrug", quip: reactions.cv, ms: 2600 });
const nudgeEmail = () => companion.react({ pose: "celebrate", quip: reactions.email, ms: 2600 });

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

function Stage({ index, children, wide = false }: { index: number; children: ReactNode; wide?: boolean }) {
  const def = sections[index];
  // Content sits on the side opposite the character.
  const align = def.side === "right" ? "lg:mr-auto" : "lg:ml-auto";
  return (
    <section
      id={def.id}
      data-section={index}
      aria-label={def.label}
      className="relative flex min-h-screen items-center px-5 pb-44 pt-24 sm:px-8 lg:px-14 lg:pb-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          className={`w-full ${wide ? "lg:w-[58%]" : "lg:w-[52%]"} ${align}`}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.09 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div variants={reveal} className="mb-7">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
    </motion.div>
  );
}

export function Hero() {
  return (
    <Stage index={0}>
      <motion.p variants={reveal} className="eyebrow mb-5">
        {profile.role} · {profile.company}
      </motion.p>
      <motion.h1 variants={reveal} className="text-5xl font-extrabold leading-[1.02] sm:text-6xl xl:text-7xl">
        Anesu <span className="text-gold">Kamombe</span>
      </motion.h1>
      <motion.p variants={reveal} className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        {profile.tagline}
      </motion.p>
      <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
        <a href="#projects" className="btn-gold">
          See my work <ArrowDown className="h-4 w-4" />
        </a>
        <a href={profile.cv} download className="btn-ghost" onPointerEnter={nudgeCv}>
          <Download className="h-4 w-4" /> Download CV
        </a>
      </motion.div>
      <motion.dl variants={reveal} className="mt-12 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass px-4 py-4">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-2xl font-bold text-gold">{s.value}</dd>
            <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </motion.dl>
      <motion.p variants={reveal} className="mt-8 hidden text-sm text-muted-foreground lg:block">
        Psst: click the guy in the suit. Then click him too much.
      </motion.p>
    </Stage>
  );
}

export function About() {
  return (
    <Stage index={1} wide>
      <Heading eyebrow="About" title="Engineer, builder, mentor" />
      <motion.div variants={reveal}>
        <Tilt className="glass grid gap-6 p-6 sm:grid-cols-[170px_1fr] sm:p-7" max={5}>
          <div className="tilt-pop relative mx-auto h-64 w-44 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-b from-secondary/40 to-background sm:mx-0 sm:h-full sm:min-h-[270px] sm:w-full">
            <img
              src="/ava/portrait.webp"
              alt="Anesu Kamombe in a brown tweed three-piece suit, arms crossed"
              className="absolute left-1/2 top-2 w-[150%] max-w-none -translate-x-1/2"
              loading="lazy"
            />
          </div>
          <div>
            <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {summary.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {highlights.map((h) => (
                <li key={h} className="chip">{h}</li>
              ))}
            </ul>
            <p className="mt-5 flex items-center gap-2 text-sm text-foreground/80">
              <MapPin className="h-4 w-4 text-primary" /> {profile.location} · {profile.availability}
            </p>
          </div>
        </Tilt>
      </motion.div>
    </Stage>
  );
}

export function Skills() {
  return (
    <Stage index={2} wide>
      <Heading eyebrow="Core technologies" title="The stack I ship with" />
      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((g) => (
          <motion.div key={g.title} variants={reveal}>
            <Tilt className="glass h-full p-5">
              <h3 className="tilt-pop text-base font-semibold text-primary">{g.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <li key={i} className="chip">{i}</li>
                ))}
              </ul>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </Stage>
  );
}

export function Experience() {
  return (
    <Stage index={3} wide>
      <Heading eyebrow="Experience" title="Where I've been building" />
      <ol className="relative space-y-5 border-l border-primary/25 pl-6">
        {experience.map((job) => (
          <motion.li key={job.company} variants={reveal} className="relative">
            <span className="absolute -left-[31px] top-6 h-3 w-3 rounded-full border-2 border-primary bg-background" />
            <div className="glass p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold">
                  {job.role} <span className="text-primary">· {job.company}</span>
                </h3>
                <span className="text-sm text-muted-foreground">{job.period}</span>
              </div>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5 text-accent" />
                {[job.type, job.place].filter(Boolean).join(" · ") || "Internship"}
              </p>
              <ul className="mt-4 space-y-2 text-[14.5px] leading-relaxed text-foreground/85">
                {job.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </Stage>
  );
}

export function Projects() {
  return (
    <Stage index={4} wide>
      <Heading eyebrow="Selected projects" title="Built, shipped, in use" />
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <motion.div
            key={p.name}
            variants={reveal}
            onPointerEnter={() => companion.react({ quip: p.quip, ms: 3200 })}
          >
            <Tilt className="glass flex h-full flex-col p-5">
              <div className="tilt-pop">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-bold text-gold">{p.name}</h3>
                  <span className="shrink-0 text-xs text-muted-foreground">{p.period}</span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-foreground/90">{p.subtitle}</p>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="chip !px-2.5 !py-0.5 !text-xs">{s}</li>
                ))}
              </ul>
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {p.linkLabel} <ArrowUpRight className="h-4 w-4" />
              </a>
            </Tilt>
          </motion.div>
        ))}
      </div>
      <motion.p variants={reveal} className="mt-5 text-sm text-muted-foreground">
        Plus 40-odd more on{" "}
        <a href={profile.github} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
          github.com/Anesuzues
        </a>
        .
      </motion.p>
    </Stage>
  );
}

export function Credentials() {
  return (
    <Stage index={5} wide>
      <Heading eyebrow="Education & certifications" title="Always learning" />
      <motion.div variants={reveal} className="glass p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="rounded-xl border border-primary/25 bg-primary/10 p-2.5 text-primary">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold">{education.degree}</h3>
            <p className="text-sm text-muted-foreground">
              {education.school} · {education.period}
            </p>
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {education.modules.map((m) => (
            <li key={m} className="chip !text-xs">{m}</li>
          ))}
        </ul>
      </motion.div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {certifications.map((group) => (
          <motion.div key={group.year} variants={reveal} className="glass p-5">
            <h3 className="font-display text-2xl font-bold text-gold">{group.year}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-snug text-foreground/85">
              {group.items.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <motion.p variants={reveal} className="mt-5 text-sm text-muted-foreground">
        Full list of 20+ credentials on{" "}
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
          LinkedIn
        </a>
        .
      </motion.p>
    </Stage>
  );
}

export function Contact() {
  const links = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: profile.phoneHref },
    { icon: Linkedin, label: "LinkedIn", value: "anesu-kamombe", href: profile.linkedin },
    { icon: Github, label: "GitHub", value: "Anesuzues", href: profile.github },
  ];
  return (
    <Stage index={6}>
      <motion.p variants={reveal} className="eyebrow mb-3">Contact</motion.p>
      <motion.h2 variants={reveal} className="text-4xl font-extrabold leading-tight sm:text-5xl">
        Let's build <span className="text-gold">something real.</span>
      </motion.h2>
      <motion.p variants={reveal} className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Looking for someone to lead delivery on an AI platform, tighten up your cloud, or ship the thing that's been
        stuck in a backlog? I'm {profile.availability.toLowerCase()}.
      </motion.p>
      <motion.div variants={reveal} className="mt-8 grid gap-3 sm:grid-cols-2">
        {links.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="glass group flex items-center gap-4 p-4 transition-colors hover:border-primary/60"
          >
            <span className="rounded-xl border border-primary/25 bg-primary/10 p-2.5 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
              <span className="block truncate text-sm font-semibold group-hover:text-primary">{value}</span>
            </span>
          </a>
        ))}
      </motion.div>
      <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
        <a href={`mailto:${profile.email}`} className="btn-gold" onPointerEnter={nudgeEmail}>
          <Mail className="h-4 w-4" /> Say hello
        </a>
        <a href={profile.cv} download className="btn-ghost" onPointerEnter={nudgeCv}>
          <Download className="h-4 w-4" /> Download CV
        </a>
      </motion.div>
      <motion.p variants={reveal} className="mt-14 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Anesu Kamombe · {profile.location}
      </motion.p>
    </Stage>
  );
}
