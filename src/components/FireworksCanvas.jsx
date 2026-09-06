import { useEffect, useRef } from "react";

// Canvas fireworks engine — rockets launch with a fiery trail, arc upward,
// then explode into one of several burst styles (classic burst, gravity
// "willow" shower, or ring burst), plus occasional ground effects (spinning
// chakra, flower-pot fountain, bijili cracker string). Runs on
// requestAnimationFrame and respects prefers-reduced-motion.
//
// Props:
//   density   — roughly how often a new rocket auto-launches (ms)
//   opacity   — overall canvas opacity (0-1)
//   colors    — optional extra color palette mixed in with the built-ins
//   className — extra classes for positioning (e.g. "fixed inset-0 z-50")
//   maxRockets — cap on rockets in flight at once
//   interactive — if true, clicking anywhere on the page launches a rocket
//                 at the click position (default true)

const DEFAULT_PALETTES = [
  ["#ff1744", "#ff5252", "#ff6d00", "#ffffff"], // fiery red, crimson & flame orange
  ["#00e5ff", "#00b0ff", "#2979ff", "#ffffff"], // electric cyan & sapphire fire
  ["#d500f9", "#ff4081", "#ff1744", "#ffffff"], // violet flame & ruby spark
  ["#00e676", "#76ff03", "#ffffff"], // emerald green & silver flame
  ["#ff6d00", "#ff9100", "#ffab00", "#ffffff"], // deep amber & copper fire
];

export default function FireworksCanvas({
  density = 900,
  opacity = 0.9,
  colors,
  className = "",
  maxRockets = 3,
  interactive = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    function handleResize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", handleResize);

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    const palettes = colors?.length
      ? [...DEFAULT_PALETTES, colors]
      : DEFAULT_PALETTES;

    // ---- Entities -----------------------------------------------------

    class Rocket {
      constructor(startX, startY, targetX, targetY, palette) {
        this.x = startX;
        this.y = startY;
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.palette = palette;
        this.distance = Math.hypot(targetX - startX, targetY - startY);
        this.traveled = 0;
        this.angle = Math.atan2(targetY - startY, targetX - startX);
        this.speed = rand(6, 9);
        this.history = [];
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 5) this.history.shift();

        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.x += vx;
        this.y += vy;
        this.traveled = Math.hypot(this.x - this.startX, this.y - this.startY);

        if (Math.random() < 0.6) trailSparks.push(new TrailSpark(this.x, this.y));

        return this.traveled >= this.distance;
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        if (this.history.length > 0) {
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (const p of this.history) ctx.lineTo(p.x, p.y);
        } else {
          ctx.moveTo(this.x, this.y);
        }
        ctx.strokeStyle = "#ff5e14";
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff2200";
        ctx.stroke();
        ctx.restore();
      }
    }

    class TrailSpark {
      constructor(x, y) {
        this.x = x + rand(-2, 2);
        this.y = y + rand(0, 4);
        this.alpha = 1;
        this.decay = rand(0.04, 0.08);
        this.size = rand(1, 2.5);
        this.color = Math.random() < 0.5 ? "#ff3d00" : "#ff9100";
      }
      update() {
        this.y += 1;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Shockwave {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.color = color;
        this.alpha = 0.8;
      }
      update() {
        this.radius += 2.5;
        this.alpha -= 0.03;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y, color, isWillow = false) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isWillow = isWillow;
        this.radius = isWillow ? rand(1.5, 2.8) : rand(2, 4);
        this.angle = rand(0, Math.PI * 2);
        this.speed = isWillow ? rand(1.5, 5) : rand(3, 9);
        this.friction = isWillow ? 0.96 : 0.94;
        this.gravity = isWillow ? 0.12 : 0.08;
        this.alpha = 1;
        this.decay = isWillow ? rand(0.01, 0.02) : rand(0.015, 0.035);
        this.flicker = Math.random() < 0.4;
        this.history = [];
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 4) this.history.shift();

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        let currentAlpha = Math.max(0, this.alpha);
        if (this.flicker && Math.random() < 0.25) currentAlpha *= 0.5;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        if (this.history.length > 1) {
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (const p of this.history) ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.radius;
          ctx.stroke();
        } else {
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    class GroundChakra {
      constructor(x) {
        this.x = x;
        this.y = height - 12;
        this.angle = 0;
        this.spinSpeed = 0.2;
        this.duration = Math.floor(rand(110, 180));
        this.frame = 0;
      }
      update() {
        this.frame++;
        this.angle += this.spinSpeed;
        if (this.frame < this.duration) {
          for (let i = 0; i < 2; i++) {
            const a = this.angle + (i * Math.PI * 2) / 2;
            chakraSparks.push(new ChakraSpark(this.x, this.y, a));
          }
          return false;
        }
        return true;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6d00";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ffea00";
        ctx.fill();
        ctx.restore();
      }
    }

    class ChakraSpark {
      constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle + rand(-0.15, 0.15);
        this.speed = rand(3, 7);
        this.friction = 0.95;
        this.gravity = 0.1;
        this.alpha = 1;
        this.decay = rand(0.015, 0.03);
        this.size = rand(1.2, 2.5);
        const cs = ["#ffea00", "#ff6d00", "#ffffff", "#ff1744", "#00e5ff"];
        this.color = cs[Math.floor(Math.random() * cs.length)];
      }
      update() {
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class BijiliCrackerString {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.count = Math.floor(rand(6, 10));
        this.frame = 0;
      }
      update() {
        this.frame++;
        if (this.frame % 5 === 0 && this.count > 0) {
          this.count--;
          const popX = this.x + rand(-15, 15);
          const popY = this.y + rand(-10, 30);
          shockwaves.push(new Shockwave(popX, popY, "#ffffff"));
          for (let i = 0; i < 6; i++) {
            particles.push(new Particle(popX, popY, Math.random() < 0.5 ? "#ffffff" : "#ff1744"));
          }
        }
        return this.count <= 0;
      }
    }

    class FlowerPotSpark {
      constructor(x, y) {
        this.x = x + rand(-3, 3);
        this.y = y;
        this.angle = -Math.PI / 2 + rand(-0.3, 0.3);
        this.speed = rand(5, 11);
        this.friction = 0.96;
        this.gravity = 0.22;
        this.alpha = 1;
        this.decay = rand(0.012, 0.025);
        this.size = rand(1.2, 2.8);
        const sc = ["#ffffff", "#ffea00", "#ff6d00", "#ff1744", "#00e676", "#00e5ff", "#ffd700"];
        this.color = sc[Math.floor(Math.random() * sc.length)];
        this.history = [];
      }
      update() {
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > 3) this.history.shift();

        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        if (this.history.length > 1) {
          ctx.moveTo(this.history[0].x, this.history[0].y);
          for (const p of this.history) ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.size;
          ctx.stroke();
        } else {
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    class FlowerPotFountain {
      constructor(x) {
        this.x = x;
        this.y = height - 10;
        this.duration = Math.floor(rand(100, 160));
        this.frame = 0;
      }
      update() {
        this.frame++;
        if (this.frame < this.duration) {
          const sparkCount = Math.floor(rand(3, 6));
          for (let i = 0; i < sparkCount; i++) flowerPotSparks.push(new FlowerPotSpark(this.x, this.y));
          return false;
        }
        return true;
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ff9100";
        ctx.shadowBlur = 14;
        ctx.shadowColor = "#ff3d00";
        ctx.fill();
        ctx.restore();
      }
    }

    // ---- State ----------------------------------------------------------

    let rockets = [];
    let particles = [];
    let shockwaves = [];
    let trailSparks = [];
    let flowerPots = [];
    let flowerPotSparks = [];
    let chakras = [];
    let chakraSparks = [];
    let bijiliStrings = [];
    let rafId;

    function launchRocket(tx, ty) {
      if (rockets.length >= maxRockets) return;
      const sx = tx + rand(-60, 60);
      const sy = height;
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      rockets.push(new Rocket(sx, sy, tx, ty, palette));
    }

    function triggerFlowerPot(x) {
      flowerPots.push(new FlowerPotFountain(x ?? rand(width * 0.2, width * 0.8)));
    }
    function triggerChakra(x) {
      chakras.push(new GroundChakra(x ?? rand(width * 0.2, width * 0.8)));
    }
    function triggerBijili(x, y) {
      bijiliStrings.push(
        new BijiliCrackerString(x ?? rand(width * 0.2, width * 0.8), y ?? rand(height * 0.3, height * 0.7))
      );
    }

    function explode(x, y, palette) {
      const burstType = Math.random();
      const primaryColor = palette[Math.floor(Math.random() * (palette.length - 1))];
      shockwaves.push(new Shockwave(x, y, primaryColor));

      if (burstType < 0.4) {
        const count = Math.floor(rand(25, 38));
        for (let i = 0; i < count; i++) {
          const color = palette[Math.floor(Math.random() * palette.length)];
          particles.push(new Particle(x, y, color));
        }
      } else if (burstType < 0.7) {
        const count = Math.floor(rand(25, 40));
        for (let i = 0; i < count; i++) {
          const color = Math.random() < 0.6 ? "#ff6d00" : Math.random() < 0.5 ? "#ff1744" : "#ffab00";
          particles.push(new Particle(x, y, color, true));
        }
      } else {
        const ringCount = 22;
        const radius = rand(3, 5);
        for (let i = 0; i < ringCount; i++) {
          const angle = (i / ringCount) * Math.PI * 2;
          const p = new Particle(x, y, palette[0]);
          p.angle = angle;
          p.speed = radius;
          particles.push(p);
        }
        for (let i = 0; i < 12; i++) particles.push(new Particle(x, y, "#ffffff"));
      }
    }

    let lastAutoLaunch = 0;
    let lastFlowerPot = 0;
    let lastChakra = 0;
    let lastBijili = 0;
    // Scale the occasional ground-effect cadence off the density prop so
    // callers can still tune "how busy" the whole canvas feels.
    const launchMin = density * 0.9;
    const launchMax = density * 1.8;

    function animate(timestamp) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      if (timestamp - lastAutoLaunch > rand(launchMin, launchMax)) {
        const tx = rand(width * 0.2, width * 0.8);
        const ty = rand(height * 0.12, height * 0.4);
        launchRocket(tx, ty);
        lastAutoLaunch = timestamp;
      }

      if (timestamp - lastFlowerPot > rand(12000, 18000)) {
        triggerFlowerPot();
        lastFlowerPot = timestamp;
      }
      if (timestamp - lastChakra > rand(14000, 20000)) {
        triggerChakra();
        lastChakra = timestamp;
      }
      if (timestamp - lastBijili > rand(16000, 24000)) {
        triggerBijili();
        lastBijili = timestamp;
      }

      chakras = chakras.filter((c) => {
        c.draw();
        return !c.update();
      });
      chakraSparks = chakraSparks.filter((cs) => {
        cs.update();
        cs.draw();
        return cs.alpha > 0;
      });
      bijiliStrings = bijiliStrings.filter((b) => !b.update());
      flowerPots = flowerPots.filter((fp) => {
        fp.draw();
        return !fp.update();
      });
      flowerPotSparks = flowerPotSparks.filter((fps) => {
        fps.update();
        fps.draw();
        return fps.alpha > 0;
      });
      rockets = rockets.filter((r) => {
        r.draw();
        if (r.update()) {
          explode(r.targetX, r.targetY, r.palette);
          return false;
        }
        return true;
      });
      shockwaves = shockwaves.filter((sw) => {
        sw.update();
        sw.draw();
        return sw.alpha > 0;
      });
      trailSparks = trailSparks.filter((ts) => {
        ts.update();
        ts.draw();
        return ts.alpha > 0;
      });
      particles = particles.filter((p) => {
        p.update();
        p.draw();
        return p.alpha > 0;
      });

      rafId = requestAnimationFrame(animate);
    }

    function handleClick(e) {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "BUTTON" || tag === "A") return;
      const rect = canvas.getBoundingClientRect();
      launchRocket(e.clientX - rect.left, e.clientY - rect.top);
    }
    if (interactive) window.addEventListener("click", handleClick);

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      if (interactive) window.removeEventListener("click", handleClick);
    };
  }, [density, colors, maxRockets, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none block h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
