// Lightweight, CSS-only firework burst — a handful of sparks that shoot
// outward and fade, looping continuously. Pure CSS animation (no JS
// timers/canvas) so it stays cheap even on low-end phones.
// `count` bursts are placed at different spots/delays for a lively feel.

const COLORS = ["#F7C948", "#EAAC1F", "#FF6B6B", "#FDE68A", "#FFFFFF"];

function Burst({ left, top, delay, scale = 1 }) {
  const sparks = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div
      className="firework-burst"
      style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }}
    >
      {sparks.map((i) => {
        const angle = (360 / sparks.length) * i;
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="firework-spark"
            style={{
              "--angle": `${angle}deg`,
              "--scale": scale,
              background: color,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function FireworkBurst({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <Burst left={15} top={25} delay={0} scale={0.9} />
      <Burst left={80} top={20} delay={1.2} scale={0.7} />
      <Burst left={50} top={60} delay={2.4} scale={1} />
    </div>
  );
}
