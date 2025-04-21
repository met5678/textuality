import {
  Application,
  ColorSource,
  Particle,
  ParticleContainer,
  Texture,
} from 'pixi.js';
import { Weather } from '/imports/schemas/derby/race';
import { DropShadowFilter, GlowFilter, OutlineFilter } from 'pixi-filters';
import { deg2rad } from '/imports/utils/deg-2-rad';
import { RaceController } from '../subscreens/RaceActive/RacePixi/RaceController';

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
  drop.anchorY = 1;
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
  drop.scaleX = config.dropWidth ?? 15;
  drop.scaleY = config.dropLength ?? 1;

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
    intensity: 0.5,
    direction: 87,
    speed: 20,
    dropLength: 100,
    dropWidth: 10,
    dropAlpha: 0.05,
    color: '#ffffff',
  },
  storm: {
    intensity: 1,
    direction: 30,
    speed: 8,
    dropLength: 25,
    dropWidth: 2.5,
    dropAlpha: 0.4,
    color: '#9999ff',
  },
};

export class WeatherOverlayPixi {
  private app: Application;
  private rainContainer: ParticleContainer;
  private raindrops: Particle[] = [];
  private rainConfig: RainConfig = getRainConfig('rain');
  private raceController: RaceController | undefined;
  private _lastXOffset: number = 0;
  private _initialized: boolean = false;

  constructor(raceController?: RaceController) {
    this.app = new Application();
    this.rainContainer = new ParticleContainer();
    this.rainContainer.label = 'rain-container';
    this.raceController = raceController;
  }

  public async init(wrapper: HTMLDivElement) {
    await this.app.init({
      resizeTo: wrapper,
      autoStart: true,
      backgroundAlpha: 0,
    });
    wrapper.appendChild(this.app.canvas);
    this.app.stage.addChild(this.rainContainer);
    // this.rainContainer.filters = new OutlineFilter({
    //   color: 0x333399,
    //   thickness: 2,
    //   alpha: 0.5,
    // });
    // this.rainContainer.filterArea = this.app.screen;
    this.updateRaindrops();
    this.app.ticker.add(this.update, this);
    this._initialized = true;
  }

  public async setWeather(weather: Weather) {
    if (!this._initialized) {
      // Wait until initialized
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.rainConfig = getRainConfig(weather);
    this.updateRaindrops();
  }

  private updateRaindrops(): void {
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
      drop.rotation = this.rainConfig.direction + Math.PI / 2;

      this.rainContainer.addParticle(drop);
    }

    this.rainContainer.removeParticles(numDrops);
  }

  public update(): void {
    const cos = Math.cos(this.rainConfig.direction);
    const sin = Math.sin(this.rainConfig.direction);

    const boundsPadding = 20;

    let offsetX = this._lastXOffset;
    if (this.raceController) {
      offsetX = this.raceController.getViewport().getOffsetX();
    }

    const numDrops = Math.floor(this.rainConfig.intensity * 1000);

    for (let i = 0; i < numDrops; i++) {
      const drop = this.raindrops[i];
      if (!drop) {
        continue;
      }

      const speed =
        (drop.scaleY / this.rainConfig.dropLength) * this.rainConfig.speed;

      // Move the raindrop
      drop.x += speed * cos;
      drop.y += speed * sin;

      if (offsetX !== this._lastXOffset) {
        drop.x += offsetX - this._lastXOffset;
      }

      if (drop.x < -boundsPadding) {
        const overshoot = drop.x + boundsPadding;
        drop.x = this.app.screen.width + boundsPadding - overshoot;
      } else if (drop.x > this.app.screen.width + boundsPadding) {
        const overshoot = drop.x - (this.app.screen.width + boundsPadding);
        drop.x = -boundsPadding + overshoot;
      }

      if (drop.y > this.app.screen.height + boundsPadding) {
        const overshoot = drop.y - (this.app.screen.height + boundsPadding);
        drop.y = -boundsPadding + overshoot;
      } else if (drop.y < -boundsPadding) {
        const overshoot = drop.y + boundsPadding;
        drop.y = this.app.screen.height + boundsPadding - overshoot;
      }
    }

    this._lastXOffset = offsetX;
  }

  public destroy(): void {
    this.app.destroy(true);
  }
}
