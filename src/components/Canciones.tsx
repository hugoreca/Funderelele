import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Song {
  title: string;
  artist: string;
  link: string;
  note: string;
}

type Mood = 'cursis' | 'euforia' | 'calmadas' | 'mágicas' | 'oníricas';
const moods: Mood[] = ['cursis', 'euforia', 'calmadas', 'mágicas', 'oníricas'];

const moodEmoji: Record<Mood, string> = {
  cursis: '♡',
  euforia: '☀️',
  calmadas: '🌊',
  'mágicas': '✧',
  'oníricas': '🌙',
};

const Canciones = () => {
  const [songs, setSongs] = useState<Record<Mood, Song[]>>({} as any);
  const [activeMood, setActiveMood] = useState<Mood>('cursis');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorite-songs', []);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/songs.json`)
      .then(r => r.json())
      .then(setSongs);
  }, []);

  const currentSongs = songs[activeMood] || [];

  const toggleFavorite = (title: string) => {
    setFavorites(prev =>
      prev.includes(title) ? prev.filter(f => f !== title) : [...prev, title]
    );
  };

  const randomSong = () => {
    const allSongs = Object.values(songs).flat();
    if (allSongs.length === 0) return;
    const song = allSongs[Math.floor(Math.random() * allSongs.length)];
    window.open(song.link, '_blank');
  };

  return (
    <section id="canciones" className="min-h-screen py-20 px-4 md:px-8 relative z-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="pixel-font text-secondary text-center text-xs md:text-sm mb-8 tracking-wider">
          CANCIONES
        </h2>

        {/* Mood tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {moods.map(mood => (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              className={`px-4 py-2 rounded-full text-xs tracking-wider font-light transition-all duration-300
                ${activeMood === mood
                  ? 'bg-secondary/20 text-foreground border border-secondary/40 shadow-[var(--glow-secondary)]'
                  : 'text-foreground/40 border border-transparent hover:text-foreground/70'
                }`}
            >
              {moodEmoji[mood]} {mood}
            </button>
          ))}
        </div>

        {/* Random button */}
        <div className="text-center mb-8">
          <button
            onClick={randomSong}
            className="text-foreground/30 hover:text-foreground/60 text-xs tracking-wider transition-all duration-300 border border-foreground/10 hover:border-foreground/30 rounded-full px-5 py-2"
          >
            ✦ random song
          </button>
        </div>

        {/* Song list */}
        <div className="space-y-3">
          {currentSongs.map(song => (
            <div
              key={song.title}
              className="inventory-slot p-4 flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <a
                  href={song.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors"
                >
                  {song.title}
                </a>
                <p className="text-foreground/30 text-xs mt-0.5">{song.artist}</p>
                <p className="text-foreground/20 text-xs mt-1 italic font-light">{song.note}</p>
              </div>
              <button
                onClick={() => toggleFavorite(song.title)}
                className={`text-lg transition-all duration-300 ml-3 ${
                  favorites.includes(song.title) ? 'text-accent' : 'text-foreground/15 hover:text-foreground/40'
                }`}
              >
                {favorites.includes(song.title) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Canciones;
