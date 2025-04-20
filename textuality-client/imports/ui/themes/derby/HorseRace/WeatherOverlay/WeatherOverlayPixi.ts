import { Application, Particle, ParticleContainer, Texture } from 'pixi.js';
import { Weather } from '/imports/schemas/derby/race';

interface RainConfig {
  intensity: number; // 0-1
  direction: number; // angle in radians
  speed: number;
  dropLength: number;
  dropWidth: number;
  dropAlpha: number;
}

const makeRaindrop = (config: RainConfig) => {
  const drop = new Particle(Texture.WHITE);
  drop.anchorX = 0.5;
  drop.anchorY = 1;
  drop.tint = 0x995555;
  drop.alpha = config.dropAlpha;
  drop.scaleX = config.dropWidth;
  drop.scaleY = config.dropLength;
  return drop;
};

const WEATHER_RAIN_CONFIG: Record<Weather, RainConfig> = {
  clear: {
    intensity: 0,
    direction: 0,
    speed: 0,
    dropLength: 0,
    dropWidth: 0,
    dropAlpha: 0,
  },
  rain: {
    intensity: 1,
    direction: (2.2 * Math.PI) / 4, // 45 degrees
    speed: 2,
    dropLength: 20,
    dropWidth: 3,
    dropAlpha: 0.5,
  },
  windy: {
    intensity: 0,
    direction: (3.5 * Math.PI) / 4, // 45 degrees
    speed: 10,
    dropLength: 10,
    dropWidth: 1,
    dropAlpha: 0.1,
  },
  storm: {
    intensity: 2,
    direction: (2.6 * Math.PI) / 4, // 45 degrees
    speed: 5,
    dropLength: 25,
    dropWidth: 4,
    dropAlpha: 0.3,
  },
};

export class WeatherOverlayPixi {
  private app: Application;
  private rainContainer: ParticleContainer;
  private raindrops: Particle[] = [];
  private dropTexture: Texture = Texture.WHITE;
  private config: RainConfig;

  private _lastFrameTime: number = 0;
  private _initialized: boolean = false;

  constructor() {
    this.app = new Application();
    this.rainContainer = new ParticleContainer();

    // Create a simple raindrop texture
    this.config = WEATHER_RAIN_CONFIG['clear'];
  }

  public async init(wrapper: HTMLDivElement) {
    await this.app.init({
      resizeTo: wrapper,
      autoStart: true,
      backgroundAlpha: 0,
    });
    wrapper.appendChild(this.app.canvas);
    this.app.stage.addChild(this.rainContainer);
    this.updateRaindrops();
    this.app.ticker.add(this.update, this);
    this._initialized = true;
  }

  public async setWeather(weather: Weather) {
    console.log('setWeather', weather);
    if (!this._initialized) {
      // Wait until initialized
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.config = WEATHER_RAIN_CONFIG[weather];
    this.updateRaindrops();
  }

  private updateRaindrops(): void {
    // Clear existing raindrops
    this.rainContainer.removeParticles(0, this.raindrops.length - 1);
    this.raindrops = [];

    // Calculate number of raindrops based on intensity
    const numDrops = Math.floor(this.config.intensity * 1000);

    for (let i = 0; i < numDrops; i++) {
      const drop = makeRaindrop(this.config);

      // Random starting position
      drop.x = Math.random() * (this.app.screen.width + 1000) - 500;
      drop.y = Math.random() * this.app.screen.height;
      drop.rotation = this.config.direction + Math.PI / 2;

      this.raindrops.push(drop);
      this.rainContainer.addParticle(drop);
    }
  }

  public update(): void {
    const speed = this.config.speed;
    const cos = Math.cos(this.config.direction);
    const sin = Math.sin(this.config.direction);

    this.raindrops.forEach((drop) => {
      // Move the raindrop
      drop.x += speed * cos;
      drop.y += speed * sin;

      // Reset position if out of bounds
      if (
        drop.x < -20 ||
        drop.x > this.app.screen.width + 20 ||
        drop.y < -20 ||
        drop.y > this.app.screen.height + 20
      ) {
        drop.x = Math.random() * (this.app.screen.width + 1000) - 500;
        drop.y = -20;
      }
    });
  }

  public destroy(): void {
    this.app.destroy(true);
  }
}
