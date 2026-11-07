import type { Team } from "@/lib/teams";

const SHIELD =
  "M50 4 L92 16 V52 C92 78 72 94 50 102 C28 94 8 78 8 52 V16 Z";

export default function TeamShield({ team, id }: { team: Team; id: string }) {
  const { primary: p, secondary: s, pattern } = team;
  return (
    <svg viewBox="0 0 100 106" className="shield" aria-hidden="true">
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={SHIELD} />
        </clipPath>
        <linearGradient id={`gloss-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <rect width="100" height="106" fill={p} />
        {pattern === "stripes" &&
          [12, 36, 60, 84].map((x) => (
            <rect key={x} x={x} y="0" width="12" height="106" fill={s} />
          ))}
        {pattern === "hoops" &&
          [14, 42, 70, 98].map((y) => (
            <rect key={y} x="0" y={y} width="100" height="14" fill={s} />
          ))}
        {pattern === "halves" && <rect x="50" y="0" width="50" height="106" fill={s} />}
        {pattern === "sash" && (
          <polygon points="0,30 0,58 100,106 100,78" fill={s} />
        )}
        <rect width="100" height="106" fill={`url(#gloss-${id})`} />
      </g>
      <path d={SHIELD} fill="none" stroke="#F5C542" strokeWidth="4" />
      <circle cx="50" cy="52" r="20" fill="#0b1a10" stroke="#F5C542" strokeWidth="2.5" />
      <text
        x="50"
        y="53"
        textAnchor="middle"
        dominantBaseline="central"
        className="shield-text"
      >
        {team.short}
      </text>
    </svg>
  );
}
