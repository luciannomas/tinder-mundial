export default function VideoSlot({ src, poster }: { src?: string; poster?: string }) {
  return (
    <div className="screen">
      <div className="screen-inner">
        {src ? (
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            className="screen-video"
          />
        ) : (
          <div className="screen-placeholder">
            <div className="play">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </div>
            <p className="screen-title">El video oficial llega pronto</p>
            <p className="screen-sub">Calentando en la zona de suplentes…</p>
          </div>
        )}
      </div>
      {!src && (
        <div className="screen-live">
          <span className="dot" /> PRÓXIMAMENTE
        </div>
      )}
    </div>
  );
}
