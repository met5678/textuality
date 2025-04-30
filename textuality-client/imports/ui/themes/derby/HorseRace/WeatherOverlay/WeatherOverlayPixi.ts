import {
  Application,
  ColorSource,
  Particle,
  ParticleContainer,
  Texture,
} from 'pixi.js';
import { Weather } from '/imports/schemas/derby/race';
import { deg2rad } from '/imports/utils/deg-2-rad';
import { RaceController } from '../subscreens/RaceActive/RacePixi/RaceController';
import { LightningOverlayPixi } from './LightningOverlayPixi';
import { SunOverlayPixi } from './SunOverlayPixi';

interface RainConfig {
  /**
   * How many thousands of raindrops to show.
   */
  intensity: number;

  /**
   * Angle in degrees. 0 is straight down.
   */
  direction: number;

  /**
   * Speed of the raindrops.
   */
  speed: number;

  /**
   * Length of the raindrops.
   */
  dropLength: number;

  /**
   * Width of the raindrops.
   */
  dropWidth: number;

  /**
   * Alpha of the raindrops.
   */
  dropAlpha: number;

  /**
   * Color of the raindrops.
   */
  color: ColorSource;
}

const makeRaindrop = (config: Partial<RainConfig>) => {
  const drop = new Particle(Texture.WHITE);
  drop.color = 0xffffff;
  drop.anchorX = 0.5;
  drop.anchorY = 0.5;
  drop.rotation = config.direction ?? 0;
  drop.tint = config.color ?? 0xaaaaaa;
  drop.alpha = config.dropAlpha ?? 0.5;
  drop.scaleX = config.dropWidth ?? 15;
  drop.scaleY = config.dropLength ?? 1;

  const scaleMultiplier = Math.random() + 0.5;

  drop.scaleX *= scaleMultiplier;
  drop.scaleY *= scaleMultiplier;
  return drop;
};

const updateRaindrop = (drop: Particle, config: Partial<RainConfig>) => {
  drop.rotation = config.direction ?? 0;
  drop.tint = config.color ?? 0xaaaaaa;
  drop.alpha = config.dropAlpha ?? 0.5;
  drop.scaleX = config.dropLength ?? 15;
  drop.scaleY = config.dropWidth ?? 1;

  const scaleMultiplier = Math.random() + 0.5;
  drop.scaleX *= scaleMultiplier;
  drop.scaleY *= scaleMultiplier;
};

const getRainConfig = (weather: Weather): RainConfig => {
  const partialConfig = WEATHER_RAIN_CONFIG[weather];
  return {
    ...partialConfig,
    intensity: partialConfig.intensity ?? 0,
    direction: deg2rad((partialConfig.direction ?? 0) + 90),
    speed: partialConfig.speed ?? 0,
    dropLength: partialConfig.dropLength ?? 0,
    dropWidth: partialConfig.dropWidth ?? 0,
    dropAlpha: partialConfig.dropAlpha ?? 0,
    color: partialConfig.color ?? 0,
  };
};

const WEATHER_RAIN_CONFIG: Record<Weather, Partial<RainConfig>> = {
  clear: {
    intensity: 0,
  },
  rain: {
    intensity: 1,
    direction: 15,
    speed: 5,
    dropLength: 15,
    dropWidth: 2,
    dropAlpha: 0.4,
    color: '#9999ff',
  },
  windy: {
    intensity: 0.3,
    direction: 88,
    speed: 5,
    dropLength: 200,
    dropWidth: 10,
    dropAlpha: 0.05,
    color: '#ffffff',
  },
  storm: {
    intensity: 1,
    direction: 30,
    speed: 16,
    dropLength: 30,
    dropWidth: 3,
    dropAlpha: 0.25,
    color: '#7777dd',
  },
};

export class WeatherOverlayPixi {
  private app: Application;
  private rainContainer: ParticleContainer;
  private raindrops: Particle[] = [];
  private rainConfig: RainConfig = getRainConfig('rain');
  private raceController: RaceController | undefined;
  private _lastLeadingX: number = 0;
  private _initialized: boolean = false;
  private lightningOverlay: LightningOverlayPixi;

  constructor(raceController?: RaceController) {
    this.app = new Application();
    this.rainContainer = new ParticleContainer();
    this.rainContainer.label = 'rain-container';
    this.lightningOverlay = new LightningOverlayPixi();
    if (raceController) {
      this.hookupRaceController(raceController);
    }
  }

  hookupRaceController(raceController: RaceController) {
    this.raceController = raceController;
  }

  public async init(wrapper: HTMLDivElement) {
    console.log('init', { wrapper, app: this.app });
    await this.app.init({
      resizeTo: wrapper,
      autoStart: true,
      backgroundAlpha: 0,
      preference: 'webgl',
      preferWebGLVersion: 2,
    });
    wrapper.appendChild(this.app.canvas);
    this.app.stage.addChild(this.rainContainer);
    this.app.stage.addChild(this.lightningOverlay);
    this.populateRaindrops();
    this.lightningOverlay.updateSize(
      this.app.screen.width,
      this.app.screen.height,
    );

    this.app.ticker.add(this.update, this);
    this._initialized = true;
  }

  public async setWeather(weather: Weather) {
    if (!this._initialized) {
      // Wait until initialized
      while (!this._initialized) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
    this.rainConfig = getRainConfig(weather);
    this.lightningOverlay.updateSize(
      this.app.screen.width,
      this.app.screen.height,
    );
    this.populateRaindrops();
  }

  private populateRaindrops(): void {
    // Clear existing raindrops
    this.rainContainer.removeParticles(0, this.raindrops.length - 1);

    // Calculate number of raindrops based on intensity
    const numDrops = Math.floor(this.rainConfig.intensity * 1000);

    for (let i = 0; i < numDrops; i++) {
      let drop = this.raindrops[i];
      if (!drop) {
        drop = makeRaindrop(this.rainConfig);
        this.raindrops.push(drop);
      } else {
        updateRaindrop(drop, this.rainConfig);
      }

      // Random starting position
      drop.x = Math.random() * (this.app.screen.width + 40) - 20;
      drop.y = Math.random() * this.app.screen.height;
      drop.rotation = this.rainConfig.direction;

      this.rainContainer.addParticle(drop);
    }

    this.rainContainer.removeParticles(numDrops);
  }

  private computeOffsetX(): number {
    if (this.raceController) {
      const leadingX = this.raceController.getViewport().getLeadingX();
      const offsetX = this._lastLeadingX - leadingX;
      this._lastLeadingX = leadingX;
      return offsetX * this.raceController.getViewport().getScale();
    }
    return 0;
  }

  public update(): void {
    const cos = Math.cos(this.rainConfig.direction);
    const sin = Math.sin(this.rainConfig.direction);

    const offsetX = this.computeOffsetX();

    for (let i = 0; i < this.rainContainer.particleChildren.length; i++) {
      const drop = this.rainContainer.particleChildren[i];
      if (!drop) {
        continue;
      }

      const speed =
        Math.max(
          drop.scaleX / this.rainConfig.dropLength,
          drop.scaleY / this.rainConfig.dropWidth,
        ) * this.rainConfig.speed;

      const boundsPaddingX = drop.scaleX / 2;
      const boundsPaddingY = drop.scaleY / 2;

      // Move the raindrop
      drop.x += speed * cos + offsetX;
      drop.y += speed * sin;

      if (drop.x < -boundsPaddingX) {
        const overshoot = drop.x + boundsPaddingX;
        drop.x = this.app.screen.width + boundsPaddingX - overshoot;
      } else if (drop.x > this.app.screen.width + boundsPaddingX) {
        const overshoot = drop.x - (this.app.screen.width + boundsPaddingX);
        drop.x = -boundsPaddingX + overshoot;
      }

      if (drop.y > this.app.screen.height + boundsPaddingY) {
        const overshoot = drop.y - (this.app.screen.height + boundsPaddingY);
        drop.y = -boundsPaddingY + overshoot;
      } else if (drop.y < -boundsPaddingY) {
        const overshoot = drop.y + boundsPaddingY;
        drop.y = this.app.screen.height + boundsPaddingY - overshoot;
      }
    }

    if (Math.random() < 0.01) {
      this.lightningOverlay.triggerFlash(Math.random() * 3 + 0.5);
    }
  }

  public destroy(): void {
    // this.app.destroy(true);
  }
}
