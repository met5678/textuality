import { ColorSource, Particle, ParticleContainer, Texture } from 'pixi.js';
import { Weather } from '/imports/schemas/derby/race';
import { deg2rad } from '/imports/utils/deg-2-rad';
import { RaceController } from '../subscreens/RaceActive/RacePixi/RaceController';
import { RaceTimelineEffectKeyframe } from '/imports/schemas/derby/race-timeline/types';
import gsap from 'gsap';

interface WindConfig {
  /**
   * How many thousands of wind particles to show.
   */
  intensity: number;

  /**
   * Angle in degrees. 0 is straight down.
   */
  direction: number;

  /**
   * Speed of the wind particles.
   */
  speed: number;

  /**
   * Length of the wind particles.
   */
  particleLength: number;

  /**
   * Width of the wind particles.
   */
  particleWidth: number;

  /**
   * Alpha of the wind particles.
   */
  particleAlpha: number;

  /**
   * Color of the wind particles.
   */
  color: ColorSource;
}

const makeWindParticle = (config: Partial<WindConfig>) => {
  const particle = new Particle(Texture.WHITE);
  particle.color = 0xffffff;
  particle.anchorX = 0.5;
  particle.anchorY = 0.5;

  return particle;
};

const updateWindParticle = (
  particle: Particle,
  config: Partial<WindConfig>,
) => {
  particle.rotation = config.direction ?? 0;
  particle.tint = config.color ?? 0xaaaaaa;
  particle.alpha = config.particleAlpha ?? 0.5;
  particle.scaleX = config.particleLength ?? 15;
  particle.scaleY = config.particleWidth ?? 1;

  const scaleMultiplier = Math.random() + 0.5;
  particle.scaleX *= scaleMultiplier;
  particle.scaleY *= scaleMultiplier;
};

const getWindConfig = (weather: Weather): WindConfig => {
  const partialConfig = WEATHER_WIND_CONFIG[weather];
  return {
    ...partialConfig,
    intensity: partialConfig.intensity ?? 0,
    direction: deg2rad(partialConfig.direction ?? 0),
    speed: partialConfig.speed ?? 0,
    particleLength: partialConfig.particleLength ?? 0,
    particleWidth: partialConfig.particleWidth ?? 0,
    particleAlpha: partialConfig.particleAlpha ?? 0,
    color: partialConfig.color ?? 0,
  };
};

const WEATHER_WIND_CONFIG: Record<Weather, Partial<WindConfig>> = {
  clear: {
    intensity: 0,
  },
  rain: {
    intensity: 0,
  },
  windy: {
    intensity: 0.3,
    direction: 180,
    speed: 5,
    particleLength: 200,
    particleWidth: 10,
    particleAlpha: 0.05,
    color: '#ffffff',
  },
  storm: {
    intensity: 0.3,
    direction: 180,
    speed: 5,
    particleLength: 200,
    particleWidth: 10,
    particleAlpha: 0.05,
    color: '#ffffff',
  },
};

const getWindGustConfig = (intensity: number): WindConfig => {
  const baseWindConfig = getWindConfig('windy');
  return {
    ...baseWindConfig,
    speed: baseWindConfig.speed * (1 + intensity),
    particleAlpha: baseWindConfig.particleAlpha * (1 + intensity),
  };
};

export class WindOverlayPixi {
  private windContainer: ParticleContainer;
  private windParticles: Particle[] = [];
  private windConfig: WindConfig = getWindConfig('clear');
  private raceController: RaceController | undefined;
  private _lastLeadingX: number = 0;
  private _initialized: boolean = false;
  private _width: number = 0;
  private _height: number = 0;
  private _currentGustFrame: RaceTimelineEffectKeyframe | undefined;
  private _lastWeather: Weather = 'clear';

  private _boundOnFrame: (frame: number) => void;

  constructor(raceController?: RaceController) {
    this.windContainer = new ParticleContainer({
      dynamicProperties: {
        alpha: true,
        color: true,
      },
    });
    this.windContainer.label = 'wind-container';
    this._boundOnFrame = this.onFrame.bind(this);
    if (raceController) {
      this.hookupRaceController(raceController);
    }
    this.populateWindParticles();
    this._lastWeather = 'clear';
  }

  public getContainer(): ParticleContainer {
    return this.windContainer;
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
    this._lastWeather = weather;
    this.windConfig = getWindConfig(weather);
    this.populateWindParticles();
  }

  private populateWindParticles(): void {
    // Clear existing wind particles
    this.windContainer.removeParticles(0, this.windParticles.length - 1);

    // Calculate number of wind particles based on intensity
    const numParticles = Math.floor(this.windConfig.intensity * 1000);

    for (let i = 0; i < numParticles; i++) {
      let particle = this.windParticles[i];
      if (!particle) {
        particle = makeWindParticle(this.windConfig);
        this.windParticles.push(particle);
      }

      // Random starting position
      particle.x = Math.random() * (this._width + 40) - 20;
      particle.y = Math.random() * this._height;
      particle.rotation = this.windConfig.direction;

      this.windContainer.addParticle(particle);
      updateWindParticle(particle, this.windConfig);
    }

    this.windContainer.removeParticles(numParticles);
  }

  private updateWindParticles(): void {
    for (let i = 0; i < this.windParticles.length; i++) {
      const particle = this.windParticles[i];
      updateWindParticle(particle, this.windConfig);
    }
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
    const cos = Math.cos(this.windConfig.direction);
    const sin = Math.sin(this.windConfig.direction);

    const offsetX = this.computeOffsetX();

    for (let i = 0; i < this.windContainer.particleChildren.length; i++) {
      const particle = this.windContainer.particleChildren[i];
      if (!particle) {
        continue;
      }

      const speed =
        Math.max(
          particle.scaleX / this.windConfig.particleLength,
          particle.scaleY / this.windConfig.particleWidth,
        ) * this.windConfig.speed;

      const boundsPaddingX = particle.scaleX / 2;
      const boundsPaddingY = particle.scaleY / 2;

      // Move the wind particle
      particle.x += speed * cos + offsetX;
      particle.y += speed * sin;

      if (particle.x < -boundsPaddingX) {
        const overshoot = particle.x + boundsPaddingX;
        particle.x = this._width + boundsPaddingX - overshoot;
      } else if (particle.x > this._width + boundsPaddingX) {
        const overshoot = particle.x - (this._width + boundsPaddingX);
        particle.x = -boundsPaddingX + overshoot;
      }

      if (particle.y > this._height + boundsPaddingY) {
        const overshoot = particle.y - (this._height + boundsPaddingY);
        particle.y = -boundsPaddingY + overshoot;
      } else if (particle.y < -boundsPaddingY) {
        const overshoot = particle.y + boundsPaddingY;
        particle.y = this._height + boundsPaddingY - overshoot;
      }
    }
  }

  private onFrame(frame: number): void {
    const windFrame = this.raceController?.getEffectAtCurrentFrame('headwind');
    if (windFrame) {
      if (
        !this._currentGustFrame ||
        this._currentGustFrame.intensity !== windFrame.intensity
      ) {
        this._currentGustFrame = windFrame;
        const gustConfig = getWindGustConfig(windFrame.intensity);
        gsap.to(this.windConfig, {
          duration: 0.5,
          speed: gustConfig.speed,
          particleAlpha: gustConfig.particleAlpha,
          onUpdate: () => {
            this.updateWindParticles();
          },
        });
      }
    } else {
      if (this._currentGustFrame) {
        this._currentGustFrame = undefined;
        const baseWindConfig = getWindConfig(this._lastWeather);
        gsap.to(this.windConfig, {
          duration: 0.5,
          speed: baseWindConfig.speed,
          particleAlpha: baseWindConfig.particleAlpha,
          onUpdate: () => {
            this.updateWindParticles();
          },
        });
      }
    }
  }

  public destroy(): void {
    if (this.raceController) {
      this.raceController.unregisterOnFrameCallback(this._boundOnFrame);
    }
  }
}
