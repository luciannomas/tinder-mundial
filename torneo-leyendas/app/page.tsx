import TeamShield from "@/components/TeamShield";
import VideoSlot from "@/components/VideoSlot";
import { TEAMS } from "@/lib/teams";

const TICKER = [
  "COMING SOON",
  "EL TORNEO DE LAS LEYENDAS",
  ...TEAMS.map((t) => t.name.toUpperCase()),
];

export default function Home() {
  const videoUrl = process.env.NEXT_PUBLIC_HOME_VIDEO_URL || undefined;

  return (
    <main className="pitch">
      <div className="pitch-lines" aria-hidden="true">
        <div className="center-line" />
        <div className="center-circle" />
        <div className="center-spot" />
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>
              {t} <b>⚽</b>
            </span>
          ))}
        </div>
      </div>

      <section className="hero">
        <div className="trophy" aria-hidden="true">🏆</div>
        <p className="kicker">Seis equipos · Una sola copa</p>
        <h1 className="title">
          <span className="title-sm">El torneo de las</span>
          <span className="title-lg">Leyendas</span>
        </h1>
        <div className="scoreboard">
          <span className="sb-label">Estado</span>
          <span className="sb-value">Coming soon</span>
        </div>
      </section>

      <section className="video-section">
        <VideoSlot src={videoUrl} />
      </section>

      <section className="teams">
        <h2 className="section-title">
          <span>Los equipos</span>
        </h2>
        <ul className="team-grid">
          {TEAMS.map((team, i) => (
            <li
              key={team.name}
              className="team-card"
              style={
                {
                  "--c1": team.primary,
                  "--c2": team.secondary,
                  animationDelay: `${i * 90}ms`,
                } as React.CSSProperties
              }
            >
              <TeamShield team={team} id={`t${i}`} />
              <span className="team-name">{team.name}</span>
              <span className="team-bar" />
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span>El Torneo de las Leyendas</span>
        <span className="footer-dot">•</span>
        <span>Se viene el pitazo inicial</span>
      </footer>
    </main>
  );
}
