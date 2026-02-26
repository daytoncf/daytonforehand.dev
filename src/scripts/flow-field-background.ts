interface Particle {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  speed: number;
  len: number;
  alpha: number;
  offset: number;
}

const resetParticle = (
    particle: Particle,
    width: number,
    height: number,
    settings: FlowFieldSettings = FLOW_FIELD_SETTINGS
): void => {
  particle.x = Math.random() * width;
  particle.y = Math.random() * height;
  particle.age = 0;
  particle.maxAge = PARTICLE_BASE_MAX_AGE + Math.random() * PARTICLE_MAX_AGE_VARIANCE;
  particle.speed = settings.speedMin + Math.random() * settings.speedRange;
  particle.len = settings.lenMin + Math.random() * settings.lenRange;
  particle.alpha = settings.alphaMin + Math.random() * settings.alphaRange;
  particle.offset = (Math.random() - 0.5) * 0.5;
};

interface FlowFieldSettings {
  minCount: number;
  density: number;
  speedMin: number;
  speedRange: number;
  lenMin: number;
  lenRange: number;
  alphaMin: number;
  alphaRange: number;
  lineWidth: number;
  fgOpacity: number;
  trailFade: number;
}

const MAX_DEVICE_PIXEL_RATIO = 2;
const DEVICE_PIXEL_RATIO_FALLBACK = 1;
const TIME_MS_TO_SECONDS = 0.001;

const PARTICLE_BASE_MAX_AGE = 120;
const PARTICLE_MAX_AGE_VARIANCE = 220;
const PARTICLE_RESET_MARGIN = 20;

const FIELD_X_FREQUENCY = 6.2;
const FIELD_Y_FREQUENCY = 7.1;
const FIELD_SIN_AMPLITUDE = 1.3;
const FIELD_COS_AMPLITUDE = 1.1;
const FIELD_TEMPO_CALM = 0.07;
const FIELD_TEMPO_LANDING = 0.12;
const FIELD_SECONDARY_TEMPO_MULTIPLIER = 0.83;

const STROKE_COLOR_RGB = '171, 208, 173';

const TRAIL_HALF_LIFE_SECONDS = 5;

const FLOW_FIELD_SETTINGS: FlowFieldSettings = {
  minCount: 140,
  density: 100000,
  speedMin: 0.26,
  speedRange: 0.4,
  lenMin: 3.2,
  lenRange: 4.2,
  alphaMin: 0.3,
  alphaRange: 0.70,
  lineWidth: 0.72,
  fgOpacity: 0.8,
  trailFade: 0.12,
};

// const FAST_SETTINGS: FlowFieldSettings = {
//   minCount: 180,
//   density: 5000,
//   speedMin: 0.45,
//   speedRange: 0.7,
//   lenMin: 4,
//   lenRange: 7,
//   alphaMin: 0.04,
//   alphaRange: 0.08,
//   lineWidth: 0.8,
//   fgOpacity: 1,
//   trailFade: 0.08,
// };

function setupPortfolioMossBackground(): void {
  const canvas = document.getElementById('portfolio-moss-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;

  // TODO: Implement reduced motion detection
  // const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particles: Particle[] = [];

  const init = (): void => {
    dpr = Math.min(MAX_DEVICE_PIXEL_RATIO, window.devicePixelRatio || DEVICE_PIXEL_RATIO_FALLBACK);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
    particles.length = 0;
    const count = Math.max(FLOW_FIELD_SETTINGS.minCount, Math.floor((width * height) / FLOW_FIELD_SETTINGS.density));

    for (let i = 0; i < count; i += 1) {
      const particle: Particle = {
        x: 0,
        y: 0,
        age: 0,
        maxAge: 0,
        speed: 0,
        len: 0,
        alpha: 0,
        offset: 0,
      };
      resetParticle(particle, width, height);
      particles.push(particle);
    }
  };

  const calculateAngleFromPositionAndTime = (x: number, y: number, t: number): number => {
    const nx = x / width;
    const ny = y / height;
    const tempo = FIELD_TEMPO_CALM;
    return (
      Math.sin(nx * FIELD_X_FREQUENCY + t * tempo) * FIELD_SIN_AMPLITUDE +
      Math.cos(ny * FIELD_Y_FREQUENCY - t * (tempo * FIELD_SECONDARY_TEMPO_MULTIPLIER)) * FIELD_COS_AMPLITUDE
    );
  };
  
  const draw = (timeInMs: number): void => {    
    const t = timeInMs * TIME_MS_TO_SECONDS;

    ctx.clearRect(0, 0, width, height)

    for (const particle of particles) {
      const angle = calculateAngleFromPositionAndTime(particle.x, particle.y, t) * particle.offset;
      const vx = Math.cos(angle) * particle.speed;
      const vy = Math.sin(angle) * particle.speed;

      const x2 = particle.x + vx * particle.len;
      const y2 = particle.y + vy * particle.len;

      const ageFraction = particle.age / particle.maxAge;
      const ageAlpha = Math.max(0, 1 - ageFraction);
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(${STROKE_COLOR_RGB}, ${particle.alpha * FLOW_FIELD_SETTINGS.fgOpacity * ageAlpha})`;
      ctx.lineWidth = FLOW_FIELD_SETTINGS.lineWidth;
      ctx.stroke();

      particle.x += vx;
      particle.y += vy;
      particle.age += 1;

      if (
        particle.x < -PARTICLE_RESET_MARGIN ||
        particle.x > width + PARTICLE_RESET_MARGIN ||
        particle.y < -PARTICLE_RESET_MARGIN ||
        particle.y > height + PARTICLE_RESET_MARGIN ||
        particle.age > particle.maxAge
      ) {
        resetParticle(particle, width, height, FLOW_FIELD_SETTINGS);
      }
    }

    raf = requestAnimationFrame(draw);
  };

  init();
  raf = requestAnimationFrame(draw);

  window.addEventListener('resize', init);
  window.addEventListener(
    'pagehide',
    () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', init);
    },
    { once: true },
  );
}

setupPortfolioMossBackground();
