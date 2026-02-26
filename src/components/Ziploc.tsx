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
  const [activeTag, setActiveTag] = useState<'all' | string>('all');
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
  const filtered = activeTag === 'all' ? memories : memories.filter(m => m.tags.includes(activeTag));

  useEffect(() => {
    if (memories.length === 0) return;
    const pool = filtered.length > 0 ? filtered : memories;
    setCurrent(pool[Math.floor(Math.random() * pool.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTag, memories]);

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
  const toggleSaveById = (id: string) => {
    setSaved(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };
  const isSaved = (id: string) => saved.includes(id);

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

        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTag('all')}
            className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full transition-colors duration-200 ${
              activeTag === 'all' ? 'text-foreground/60 border border-foreground/20' : 'text-foreground/20 hover:text-foreground/40'
            }`}
            aria-pressed={activeTag === 'all'}
          >
            todas
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded-full transition-colors duration-200 ${
                activeTag === tag ? 'text-foreground/60 border border-foreground/20' : 'text-foreground/20 hover:text-foreground/40'
              }`}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`inventory-slot p-4 group cursor-pointer ${current?.id === m.id ? 'border-accent/40' : ''}`}
              onClick={() => setCurrent(m)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-foreground/70 text-sm"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                    title={m.text}
                  >
                    “{m.text}”
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.tags.map((t) => (
                      <span key={t} className="text-foreground/20 text-[10px] tracking-wider uppercase">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveById(m.id);
                  }}
                  className={`text-lg transition-colors duration-200 ${
                    isSaved(m.id) ? 'text-accent' : 'text-foreground/15 hover:text-foreground/40'
                  }`}
                  aria-pressed={isSaved(m.id)}
                  aria-label={isSaved(m.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  {isSaved(m.id) ? '★' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ziploc;
