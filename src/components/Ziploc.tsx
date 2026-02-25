import { useEffect, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Memory {
  id: string;
  text: string;
  tags: string[];
}

const Ziploc = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [current, setCurrent] = useState<Memory | null>(null);
  const [saved, setSaved] = useLocalStorage<string[]>('saved-memories', []);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/memories.json`)
      .then(r => r.json())
      .then((data: Memory[]) => {
        setMemories(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      });
  }, []);

  const allTags = [...new Set(memories.flatMap(m => m.tags))];
  const filtered = activeTag ? memories.filter(m => m.tags.includes(activeTag)) : memories;

  const shuffle = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : memories;
    if (pool.length === 0) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrent(next);
  }, [filtered, memories]);

  const copyToClipboard = () => {
    if (!current) return;
    navigator.clipboard.writeText(current.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSave = () => {
    if (!current) return;
    setSaved(prev =>
      prev.includes(current.id) ? prev.filter(id => id !== current.id) : [...prev, current.id]
    );
  };

  return (
    <section id="ziploc" className="min-h-screen py-20 px-4 md:px-8 relative z-10">
      <div className="max-w-2xl mx-auto">
        <h2 className="pixel-font text-accent text-center text-xs md:text-sm mb-2 tracking-wider">
          ZIPLOC DE SONRISAS
        </h2>
        <p className="text-center text-foreground/30 text-xs mb-12 font-light tracking-wide">
          Open the bag. Pick a memory.
        </p>

        {/* Memory card */}
        {current && (
          <div className="inventory-slot p-8 md:p-12 text-center mb-8 animate-fade-in-up" key={current.id}>
            <p className="text-foreground/80 text-lg md:text-xl font-light leading-relaxed italic">
              "{current.text}"
            </p>
            <div className="flex justify-center gap-2 mt-4">
              {current.tags.map(tag => (
                <span key={tag} className="text-foreground/20 text-[10px] tracking-wider uppercase">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={shuffle}
            className="text-foreground/40 hover:text-foreground/70 text-xs tracking-wider transition-all duration-300 border border-foreground/10 hover:border-foreground/30 rounded-full px-5 py-2"
          >
            ↻ shuffle
          </button>
          <button
            onClick={toggleSave}
            className={`text-xs tracking-wider transition-all duration-300 border rounded-full px-5 py-2 ${
              current && saved.includes(current.id)
                ? 'text-accent border-accent/30'
                : 'text-foreground/40 hover:text-foreground/70 border-foreground/10 hover:border-foreground/30'
            }`}
          >
            {current && saved.includes(current.id) ? '♡ saved' : '♡ save'}
          </button>
          <button
            onClick={copyToClipboard}
            className="text-foreground/40 hover:text-foreground/70 text-xs tracking-wider transition-all duration-300 border border-foreground/10 hover:border-foreground/30 rounded-full px-5 py-2"
          >
            {copied ? '✓ copied' : '⎘ copy'}
          </button>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-300 ${
              activeTag === null ? 'text-foreground/60 border border-foreground/20' : 'text-foreground/20 hover:text-foreground/40'
            }`}
          >
            all
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-300 ${
                activeTag === tag ? 'text-foreground/60 border border-foreground/20' : 'text-foreground/20 hover:text-foreground/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ziploc;
