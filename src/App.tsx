import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const SfxClicks = () => {
  useEffect(() => {
    const files = [
      "Minecraft Villager (Huh) - Sound Effect (HD).mp3",
      "Minecraft Villager (Huh) #2 - Sound Effect (HD).mp3",
      "Minecraft Villager (Huh) #3 - Sound Effect (HD).mp3",
    ];
    const handler = (ev: MouseEvent) => {
      const t = ev.target as Element | null;
      if (!t) return;
      if (t.closest('[data-no-sfx="true"]')) return;
      const pick = files[Math.floor(Math.random() * files.length)];
      const src = `${import.meta.env.BASE_URL}audio/${encodeURIComponent(pick)}`;
      const a = new Audio(src);
      a.volume = 0.45;
      a.play().catch(() => {});
    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);
  return null;
};

const BgmToggle = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem("bgm-enabled");
      return raw ? JSON.parse(raw) : false;
    } catch {
      return false;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(`${import.meta.env.BASE_URL}audio/bgm.mp3`);
      a.loop = true;
      a.preload = "auto";
      a.volume = 1;
      a.addEventListener("error", () => {
        // eslint-disable-next-line no-console
        console.error("BGM load/play error", a.error);
      });
      audioRef.current = a;
    }
  }, []);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const a = new Audio(`${import.meta.env.BASE_URL}audio/bgm.mp3`);
      a.loop = true;
      a.preload = "auto";
      a.volume = 1;
      audioRef.current = a;
    }
    return audioRef.current!;
  };

  const onToggle = (next: boolean) => {
    const a = ensureAudio();
    if (next) {
      a.muted = false;
      a.play().catch((e) => {
        // eslint-disable-next-line no-console
        console.warn("BGM play blocked", e);
      });
    } else {
      a.pause();
      a.currentTime = 0;
    }
    setEnabled(next);
    try {
      localStorage.setItem("bgm-enabled", JSON.stringify(next));
    } catch {}
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2 backdrop-blur"
      data-no-sfx="true"
    >
      <span className="text-xs tracking-wider">BGM</span>
      <Switch checked={enabled} onCheckedChange={onToggle} data-no-sfx="true" />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SfxClicks />
      <BgmToggle />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
