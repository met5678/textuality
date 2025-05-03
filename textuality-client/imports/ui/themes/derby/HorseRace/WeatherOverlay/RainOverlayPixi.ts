import { ColorSource, Particle, ParticleContainer, Texture } from 'pixi.js';
import { Weather } from '/imports/schemas/derby/race';
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
  drop.anchorY = 0.5;
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
    direction: deg2rad(partialConfig.direction ?? 0),
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
    direction: 90,
    speed: 5,
    dropLength: 15,
    dropWidth: 2,
    dropAlpha: 0.4,
    color: '#9999ff',
  },
  windy: {
    intensity: 0,
  },
  storm: {
    intensity: 1,
    direction: 90,
    speed: 16,
    dropLength: 30,
    dropWidth: 3,
    dropAlpha: 0.25,
    color: '#7777dd',
  },
};

export class RainOverlayPixi {
  private rainContainer: ParticleContainer;
  private raindrops: Particle[] = [];
  private rainConfig: RainConfig = getRainConfig('clear');
  private raceController: RaceController | undefined;
  private _lastLeadingX: number = 0;
  private _initialized: boolean = false;
  private _width: number = 0;
  private _height: number = 0;

  private _boundOnFrame: (frame: number) => void;

  constructor(raceController?: RaceController) {
    this.rainContainer = new ParticleContainer();
    this.rainContainer.label = 'rain-container';
    this._boundOnFrame = this.onFrame.bind(this);
    if (raceController) {
      this.hookupRaceController(raceController);
    }
    this.populateRaindrops();
  }

  public getContainer(): ParticleContainer {
    return this.rainContainer;
  }

  hookupRaceController(raceController: RaceController) {
    this.raceController = raceController;
    this.raceController.registerOnFrameCallback(this._boundOnFrame);
  }

  public updateSize(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  public async setWeather(weather: Weather) {
    this.rainConfig = getRainConfig(weather);
    this.populateRaindrops();
  }

  private populateRaindrops(): void {
    // Clear existing raindrops
    this.rainContainer.removeParticles(0, this.raindrops.length - 1);

    // Calculate number of raindrops based on intensity
    const numDrops = Math.floor(this.rainConfig.intensity * 1000);

    if (numDrops === 0) {
      this.rainContainer.removeParticles(0, this.raindrops.length - 1);
      return;
    }

    for (let i = 0; i < numDrops; i++) {
      let drop = this.raindrops[i];
      if (!drop) {
        drop = makeRaindrop(this.rainConfig);
        this.raindrops.push(drop);
      }
      this.rainContainer.addParticle(drop);

      updateRaindrop(drop, this.rainConfig);

      // Random starting position
      drop.x = Math.random() * (this._width + 40) - 20;
      drop.y = Math.random() * this._height;
      drop.rotation = this.rainConfig.direction;
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

      // if (i === 0) {
      //   console.log('speed', {
      //     speed,
      //     thisRainConfigSpeed: this.rainConfig.speed,
      //     dropScaleX: drop.scaleX,
      //     dropScaleY: drop.scaleY,
      //   });
      // }

      const boundsPaddingX = drop.scaleX / 2;
      const boundsPaddingY = drop.scaleY / 2;

      // Move the raindrop
      drop.x += speed * cos + offsetX;
      drop.y += speed * sin;

      if (drop.x < -boundsPaddingX) {
        const overshoot = drop.x + boundsPaddingX;
        drop.x = this._width + boundsPaddingX - overshoot;
      } else if (drop.x > this._width + boundsPaddingX) {
        const overshoot = drop.x - (this._width + boundsPaddingX);
        drop.x = -boundsPaddingX + overshoot;
      }

      if (drop.y > this._height + boundsPaddingY) {
        const overshoot = drop.y - (this._height + boundsPaddingY);
        drop.y = -boundsPaddingY + overshoot;
      } else if (drop.y < -boundsPaddingY) {
        const overshoot = drop.y + boundsPaddingY;
        drop.y = this._height + boundsPaddingY - overshoot;
      }
    }
  }

  private onFrame(frame: number): void {
    // No frame-specific logic needed for rain
  }

  public destroy(): void {
    if (this.raceController) {
      this.raceController.unregisterOnFrameCallback(this._boundOnFrame);
    }
  }
}
