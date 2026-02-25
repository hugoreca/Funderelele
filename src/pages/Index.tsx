import { useState, useRef, useCallback } from 'react';
import Particles from '@/components/Particles';
import ConcentricCircles from '@/components/ConcentricCircles';
import SideQuests from '@/components/SideQuests';
import Canciones from '@/components/Canciones';
import Ziploc from '@/components/Ziploc';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollToSection = useCallback((section: string) => {
    // postredex -> quests section
    const target = section === 'postredex' ? 'quests' : section;
    setActiveSection(target);
    setTimeout(() => {
      const el = document.getElementById(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection(null);
  };

  return (
    <div className="forever-bg min-h-screen relative">
      <Particles />

      {/* Back to menu floating button */}
      {activeSection && (
        <button
          onClick={scrollToTop}
          className="fixed top-6 left-6 z-50 text-foreground/30 hover:text-foreground/70 text-xs tracking-[0.15em] uppercase font-light transition-all duration-500 animate-fade-in-up"
        >
          ← FOREVER
        </button>
      )}

      {/* SECTION 1: Main Menu */}
      <section className="min-h-screen flex items-center justify-center relative z-10">
        <ConcentricCircles onMenuClick={scrollToSection} />
      </section>

      {/* SECTION 2: Side Quests */}
      <SideQuests />

      {/* SECTION 3: Canciones */}
      <Canciones />

      {/* SECTION 4: Ziploc */}
      <Ziploc />

      {/* Footer */}
      <footer className="py-12 text-center relative z-10">
        <p className="text-foreground/15 text-xs tracking-[0.2em] font-light">
          A quiet place where something grows.
        </p>
      </footer>
    </div>
  );
};

export default Index;
