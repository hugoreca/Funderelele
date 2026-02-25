import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CheckItem {
  id: string;
  label: string;
  done: boolean;
}

interface Quest {
  id: string;
  title: string;
  status: string;
  description: string;
  checklist: CheckItem[];
  reward: string;
}

const statusColors: Record<string, string> = {
  locked: 'badge-locked',
  active: 'badge-active',
  complete: 'badge-complete',
};

const SideQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [progress, setProgress] = useLocalStorage<Record<string, boolean[]>>('quest-progress', {});
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/quests.json`)
      .then(r => r.json())
      .then((data: Quest[]) => setQuests(data));
  }, []);

  const toggleCheck = (questId: string, checkIndex: number) => {
    setProgress(prev => {
      const current = prev[questId] || quests.find(q => q.id === questId)?.checklist.map(() => false) || [];
      const updated = [...current];
      updated[checkIndex] = !updated[checkIndex];
      return { ...prev, [questId]: updated };
    });
  };

  const getCheckState = (questId: string, index: number) => {
    return progress[questId]?.[index] ?? false;
  };

  return (
    <section id="quests" className="min-h-screen py-20 px-4 md:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="pixel-font text-primary text-center text-xs md:text-sm mb-2 tracking-wider">
          SIDE QUESTS
        </h2>
        <p className="text-center text-foreground/40 text-sm mb-12 font-light tracking-wide">
          Inventory — {quests.filter(q => q.status !== 'locked').length} active
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map(quest => (
            <div
              key={quest.id}
              className="inventory-slot p-5 cursor-pointer"
              onClick={() => setExpandedQuest(expandedQuest === quest.id ? null : quest.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="pixel-font text-[10px] text-foreground/90 leading-relaxed">
                  {quest.title}
                </h3>
                <span className={`pixel-font text-[8px] px-2 py-1 rounded-sm uppercase ${statusColors[quest.status]}`}>
                  {quest.status}
                </span>
              </div>

              <p className="text-foreground/50 text-sm mb-3 font-light">
                {quest.description}
              </p>

              {expandedQuest === quest.id && (
                <div className="animate-fade-in-up space-y-2 mt-4 border-t border-border/30 pt-4">
                  {quest.checklist.map((item, i) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 text-sm cursor-pointer group"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => quest.status !== 'locked' && toggleCheck(quest.id, i)}
                        className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all
                          ${getCheckState(quest.id, i)
                            ? 'bg-primary/30 border-primary'
                            : 'border-foreground/20 group-hover:border-foreground/40'
                          }
                          ${quest.status === 'locked' ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                      >
                        {getCheckState(quest.id, i) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" className="text-primary">
                            <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          </svg>
                        )}
                      </button>
                      <span className={`font-light ${getCheckState(quest.id, i) ? 'text-foreground/30 line-through' : 'text-foreground/60'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                  <p className="text-accent/60 text-xs mt-3 italic">
                    ✧ {quest.reward}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideQuests;
