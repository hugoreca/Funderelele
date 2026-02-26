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
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-2 backdrop-blur">
      <span className="text-xs tracking-wider">BGM</span>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
