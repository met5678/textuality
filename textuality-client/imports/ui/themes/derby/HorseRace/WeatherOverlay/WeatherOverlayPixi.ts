import { Application } from 'pixi.js';
import { Weather } from '/imports/schemas/derby/race';
import { RaceController } from '../subscreens/RaceActive/RacePixi/RaceController';
import { LightningOverlayPixi } from './LightningOverlayPixi';
import { RainOverlayPixi } from './RainOverlayPixi';
import { WindOverlayPixi } from './WindOverlayPixi';

export class WeatherOverlayPixi {
  private app: Application;
  private raceController: RaceController | undefined;
  private _initialized: boolean = false;
  private lightningOverlay: LightningOverlayPixi;
  private rainOverlay: RainOverlayPixi;
  private windOverlay: WindOverlayPixi;

  private _boundOnFrame: (frame: number) => void;

  constructor(raceController?: RaceController) {
    this.app = new Application();
    this.lightningOverlay = new LightningOverlayPixi();
    this.rainOverlay = new RainOverlayPixi();
    this.windOverlay = new WindOverlayPixi();
    this._boundOnFrame = this.onFrame.bind(this);
    if (raceController) {
      this.hookupRaceController(raceController);
    }
  }

  hookupRaceController(raceController: RaceController) {
    this.raceController = raceController;
    this.raceController.registerOnFrameCallback(this._boundOnFrame);
    this.rainOverlay.hookupRaceController(raceController);
    this.windOverlay.hookupRaceController(raceController);
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

    // Add all overlays to the stage
    this.app.stage.addChild(this.lightningOverlay);
    this.app.stage.addChild(this.rainOverlay.getContainer());
    this.app.stage.addChild(this.windOverlay.getContainer());

    // Update sizes
    this.lightningOverlay.updateSize(
      this.app.screen.width,
      this.app.screen.height,
    );
    this.rainOverlay.updateSize(this.app.screen.width, this.app.screen.height);
    this.windOverlay.updateSize(this.app.screen.width, this.app.screen.height);

    // Add update callbacks
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
    await this.rainOverlay.setWeather(weather);
    await this.windOverlay.setWeather(weather);
  }

  public update(): void {
    this.rainOverlay.update();
    this.windOverlay.update();
  }

  private onFrame(frame: number): void {
    if (this.raceController) {
      const lightningEffect =
        this.raceController.getEffectAtCurrentFrame('lightning');
      if (lightningEffect) {
        this.lightningOverlay.triggerFlash(lightningEffect.intensity);
      }
    }
  }

  public destroy(): void {
    if (this.raceController) {
      this.raceController.unregisterOnFrameCallback(this._boundOnFrame);
    }
    this.lightningOverlay.destroy();
    this.rainOverlay.destroy();
    this.windOverlay.destroy();
    this.app.ticker.stop();
    this.app.destroy();
  }
}
