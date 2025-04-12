import {
  Application,
  Assets,
  Container,
  Texture,
  Ticker,
  TilingSprite,
} from 'pixi.js';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import RaceTrackPixi from './RaceTrack/RaceTrackPixi';
import RaceHorsePixi from './RaceHorse/RaceHorsePixi';
import { RaceController } from './RaceController';
import { loadHorseSprites } from './RaceHorse/RaceHorseSprites';
import { RaceViewport } from './RaceViewport/RaceViewport';
import { Dimensions } from './RacePixi.types';
import { RaceBackdrop } from './RaceBackdrop/RaceBackdrop';

export class RacePixi {
  private app!: Application;
  private controller: RaceController;
  private ticker: Ticker;

  private backdrop: RaceBackdrop;
  private viewport: Container = new Container();
  private tracksContainer: Container = new Container();
  private horsesContainer: Container = new Container();
  private effectsOverlay: Container = new Container();

  private worldSize: Dimensions = { width: 0, height: 0 };

  private tracks: RaceTrackPixi[] = [];
  private horses: RaceHorsePixi[] = [];

  constructor(controller: RaceController, ticker: Ticker) {
    this.controller = controller;
    this.ticker = ticker;
    this.backdrop = new RaceBackdrop();
  }

  public async init(wrapper: HTMLDivElement) {
    this.app = new Application();
    this.app.ticker = this.ticker;

    (globalThis as any).__PIXI_APP__ = this.app;
    await this.app.init({
      height: 620,
      width: 1280,
      resizeTo: wrapper,
      autoStart: true,
      backgroundColor: 0x000000,
    });
    wrapper.appendChild(this.app.canvas);

    await loadHorseSprites();
    await this.backdrop.init();

    this.app.stage.addChild(this.viewport);
    this.viewport.addChild(this.backdrop.getContainer());
    this.viewport.addChild(this.tracksContainer);
    this.viewport.addChild(this.horsesContainer);
    this.viewport.label = 'viewport';
    this.app.stage.addChild(this.effectsOverlay);
    this.tracksContainer.label = 'tracksContainer';
    this.horsesContainer.label = 'horsesContainer';
    this.effectsOverlay.label = 'effectsOverlay';
    this.viewport.scale.set(0.6);
    this.viewport.position.set(100, 100);

    this.ticker.add(() => this.update());

    console.log('started');
  }

  initTracks() {
    this.tracks.forEach((track) => {
      // this.tracks.destroy();
    });
    this.tracksContainer.removeChildren();
    this.worldSize = { width: 0, height: 0 };
    this.controller.getTracks().forEach((track) => {
      const trackPixi = new RaceTrackPixi(track);
      this.tracks.push(trackPixi);
      this.tracksContainer.addChild(trackPixi);
      this.worldSize.width = Math.max(
        this.worldSize.width,
        track.getDimensions().width,
      );
      this.worldSize.height += track.getDimensions().height;
    });
    this.controller.getHorses().forEach((horse, index) => {
      const horsePixi = new RaceHorsePixi(horse);
      this.horses.push(horsePixi);
      this.horsesContainer.addChild(horsePixi);
    });

    this.backdrop.updateWorldSize(this.worldSize);
  }

  update() {
    if (this.tracks.length !== this.controller.getNumHorses()) {
      this.initTracks();
    }
    this.tracks.forEach((track) => track.update());
    this.horses.forEach((horse) => horse.update());

    const furthestHorse = this.horses.reduce((furthest, horse) => {
      return Math.max(furthest, horse.x);
    }, 0);

    // Scale the horse's position to match viewport scale (0.5)
    const scaledFurthestHorse = furthestHorse * this.viewport.scale.x;
    this.viewport.x =
      100 - Math.max(0, scaledFurthestHorse - this.app.screen.width + 200);
  }

  destroy() {
    this.ticker.remove(this.update);
    this.backdrop.destroy();
    this.app.destroy();
  }
}
