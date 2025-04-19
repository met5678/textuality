import { Application, Container, Ticker } from 'pixi.js';
import RaceTrackPixi from './RaceTrack/RaceTrackPixi';
import RaceHorsePixi from './RaceHorse/RaceHorsePixi';
import { RaceController } from './RaceController';
import { loadHorseSprites } from './RaceHorse/RaceHorseSprites';
import { Dimensions } from './RacePixi.types';
import { RaceBackdrop } from './RaceBackdrop/RaceBackdrop';
import { RaceViewportPixi } from './RaceViewport/RaceViewportPixi';
import { RaceLines } from './RaceLines/RaceLines';
import { RaceTrackResultBannerPixi } from './RaceTrack/RaceTrackResultBannerPixi';

export class RacePixi {
  private app!: Application;
  private controller: RaceController;
  private ticker: Ticker;

  private backdrop: RaceBackdrop;
  private viewport!: RaceViewportPixi;
  private tracksContainer: Container = new Container();
  private horsesContainer: Container = new Container();
  private effectsOverlay: Container = new Container();
  private raceLines: RaceLines | null = null;
  private resultBanners: RaceTrackResultBannerPixi[] = [];
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

    this.viewport = new RaceViewportPixi(this.app, this.controller);
    this.app.stage.addChild(this.viewport.getContainer());

    // Add containers in correct order: backdrop -> tracks -> finish line -> horses -> effects
    this.viewport.addChild(this.backdrop.getContainer());
    this.viewport.addChild(this.tracksContainer);
    this.viewport.addChild(this.horsesContainer);
    this.app.stage.addChild(this.effectsOverlay);

    this.tracksContainer.label = 'tracksContainer';
    this.horsesContainer.label = 'horsesContainer';
    this.effectsOverlay.label = 'effectsOverlay';

    this.ticker.add(this.update, this);

    console.log('started');
  }

  initTracks() {
    console.log('initTracks');
    this.tracks.forEach((track) => {
      track.destroy();
    });
    this.tracks.length = 0;
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

    this.controller.getResultBanners().forEach((resultBanner) => {
      const resultBannerPixi = new RaceTrackResultBannerPixi(resultBanner);
      this.resultBanners.push(resultBannerPixi);
      this.tracksContainer.addChild(resultBannerPixi);
    });

    this.backdrop.updateWorldSize(this.worldSize);

    // Create race lines between tracks and horses
    if (this.raceLines) {
      this.raceLines.destroy();
      this.raceLines
        .getContainer()
        .parent?.removeChild(this.raceLines.getContainer());
    }
    const { furlong_length } = this.controller.getTrackData();
    this.raceLines = new RaceLines(this.controller.getTracks(), furlong_length);

    // Insert race lines between tracks and horses
    const horsesIndex = this.viewport
      .getContainer()
      .getChildIndex(this.horsesContainer);
    this.viewport
      .getContainer()
      .addChildAt(this.raceLines.getContainer(), horsesIndex);
  }

  update() {
    if (this.tracks.length !== this.controller.getNumHorses()) {
      this.initTracks();
    }
    this.tracks.forEach((track) => track.update());
    this.horses.forEach((horse) => horse.update());
    this.resultBanners.forEach((resultBanner) => resultBanner.update());
    this.viewport.update();
  }

  destroy() {
    this.ticker.remove(this.update, this);
    this.backdrop.destroy();
    this.viewport.destroy();
    this.raceLines?.destroy();
    this.app.destroy();
  }
}
