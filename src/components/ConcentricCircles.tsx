interface ConcentricCirclesProps {
  onMenuClick: (section: string) => void;
}

const menuItems = [
  { label: 'Ziploc', angle: 180, section: 'ziploc' },
  { label: 'Canciones', angle: 270, section: 'canciones' },
  { label: 'Side Quests', angle: 0, section: 'quests' },
  { label: 'PostreDex', angle: 90, section: 'postredex' },
];

const ConcentricCircles = ({ onMenuClick }: ConcentricCirclesProps) => {
  const radius = 260;

  return (
    <div className="relative w-[600px] h-[600px] max-w-[90vw] max-h-[90vw] mx-auto">
      {/* SVG Circles */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Concentric circles */}
        {[80, 130, 190, 260, 290].map((r, i) => (
          <circle
            key={r}
            cx="300"
            cy="300"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={i === 3 ? 1.5 : 0.8}
            className={i % 2 === 0 ? 'animate-rotate-slow' : 'animate-rotate-reverse'}
            style={{ transformOrigin: '300px 300px' }}
            strokeDasharray={i === 1 || i === 4 ? '4 8' : 'none'}
          />
        ))}

        {/* Geometric accents - diamond */}
        <rect
          x="255" y="255" width="90" height="90"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
          transform="rotate(45 300 300)"
          className="animate-rotate-reverse"
          style={{ transformOrigin: '300px 300px' }}
        />

        {/* Tiny dots on orbits */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const r = 190;
          const x = 300 + r * Math.cos((angle * Math.PI) / 180);
          const y = 300 + r * Math.sin((angle * Math.PI) / 180);
          return (
            <circle
              key={`dot-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="rgba(255,255,255,0.3)"
              className="animate-pulse-soft"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          );
        })}
      </svg>

      {/* Center title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1
          className="text-foreground text-4xl md:text-5xl font-light tracking-[0.4em] uppercase mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          FOREVER
        </h1>
        <p className="text-foreground/50 text-sm tracking-[0.2em] font-light">
          Side quests unlocked.
        </p>
      </div>

      {/* Orbital menu items */}
      {menuItems.map((item) => {
        const angleRad = (item.angle * Math.PI) / 180;
        const x = 50 + (radius / 300) * 50 * Math.cos(angleRad);
        const y = 50 + (radius / 300) * 50 * Math.sin(angleRad);

        return (
          <button
            key={item.section}
            onClick={() => onMenuClick(item.section)}
            className="absolute z-20 group flex items-center gap-3 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={`Navigate to ${item.label}`}
          >
            {/* Orbital dot */}
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-foreground/60 group-hover:bg-foreground transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              <div className="absolute inset-[-4px] rounded-full border border-foreground/20 group-hover:border-foreground/50 transition-all duration-500" />
              <div className="absolute inset-[-10px] rounded-full border border-foreground/0 group-hover:border-foreground/20 transition-all duration-500 group-hover:scale-110" />
            </div>
            {/* Label */}
            <span className="text-foreground/60 group-hover:text-foreground text-xs md:text-sm tracking-[0.15em] uppercase font-light transition-all duration-500 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ConcentricCircles;
