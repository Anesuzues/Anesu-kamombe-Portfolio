import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { About, Contact, Credentials, Experience, Hero, Projects, Skills } from "@/components/Sections";
import { Companion } from "@/components/Companion";
import { scrollState } from "@/components/scene/scrollState";
import { sections } from "@/data/content";

// three.js is heavy: load the 3D stage after the content is on screen.
const Scene = lazy(() => import("@/components/scene/Scene"));

function useActiveSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
      const mid = window.innerHeight * 0.5;
      let current = 0;
      document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => {
        if (el.getBoundingClientRect().top <= mid) current = Number(el.dataset.section);
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return active;
}

function Nav({ active }: { active: number }) {
  const face = sections[active].face;
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
          <a href="#home" className="glass flex items-center gap-3 !rounded-full py-1.5 pl-1.5 pr-4">
            <img
              key={face}
              src={`/ava/face-${face}.webp`}
              alt=""
              className="h-9 w-9 rounded-full border border-primary/40 object-cover"
            />
            <span className="font-display text-sm font-semibold">Anesu Kamombe</span>
          </a>
          <nav aria-label="Sections" className="glass hidden items-center gap-1 !rounded-full px-2 py-1.5 lg:flex">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={i === active ? "true" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  i === active ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* progress rail (mobile + tablet) */}
      <nav aria-label="Section progress" className="fixed left-0 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-1.5 lg:hidden">
        {sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} aria-label={s.label} className="grid h-5 w-4 place-items-center">
            <span className={`block rounded-full transition-all ${i === active ? "h-3 w-1.5 bg-primary" : "h-1.5 w-1.5 bg-foreground/30"}`} />
          </a>
        ))}
      </nav>
    </>
  );
}

const App = () => {
  const active = useActiveSection();
  const [stageReady, setStageReady] = useState(false);
  const onReady = useCallback(() => setStageReady(true), []);
  return (
    <>
      <Suspense fallback={null}>
        <Scene section={active} onReady={onReady} />
      </Suspense>
      <div className="stage-loading" style={{ opacity: stageReady ? 0 : 1 }} role="status" aria-hidden={stageReady}>
        Setting the stage…
      </div>
      <Nav active={active} />
      <Companion section={active} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Credentials />
        <Contact />
      </main>
    </>
  );
};

export default App;
