import { Application, Container } from 'pixi.js';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import RaceTrackPixi from './RaceTrack/RaceTrackPixi';
import RaceHorsePixi from './RaceHorse/RaceHorsePixi';
import { RaceController } from './RaceController';

export class RacePixi {
  private app!: Application;
  private controller: RaceController;

  private backdrop: Container = new Container();
  private tracksContainer: Container = new Container();
  private horsesContainer: Container = new Container();
  private effectsOverlay: Container = new Container();

  private tracks: RaceTrackPixi[] = [];
  private horses: RaceHorsePixi[] = [];

  constructor(controller: RaceController) {
    this.controller = controller;
  }

  public async init(wrapper: HTMLDivElement) {
    this.app = new Application();
    (globalThis as any).__PIXI_APP__ = this.app;
    await this.app.init({
      height: 620,
      width: 1280,
      resizeTo: wrapper,
      autoStart: true,
      backgroundColor: 0x000000,
    });
    wrapper.appendChild(this.app.canvas);

    this.app.stage.addChild(this.backdrop);
    this.app.stage.addChild(this.tracksContainer);
    this.app.stage.addChild(this.horsesContainer);
    this.app.stage.addChild(this.effectsOverlay);
    this.backdrop.label = 'backdrop';
    this.tracksContainer.label = 'tracksContainer';
    this.horsesContainer.label = 'horsesContainer';
    this.effectsOverlay.label = 'effectsOverlay';

    this.app.ticker.add(() => this.update());
    this.app.ticker.start();
  }

  initTracks() {
    this.tracks.forEach((track) => {
      // this.tracks.destroy();
    });
    this.tracksContainer.removeChildren();
    // this.horses.push(new RaceHorsePixi(this.app, this.controller));
    this.controller.getTracks().forEach((track) => {
      this.tracks.push(new RaceTrackPixi(track));
      this.tracksContainer.addChild(this.tracks[this.tracks.length - 1]);
    });
  }

  update() {
    if (this.tracks.length !== this.controller.getNumHorses()) {
      this.initTracks();
    }
    this.tracks.forEach((track) => track.update());
  }

  destroy() {
    this.app.ticker.remove(this.update);
    this.app.ticker.destroy();
    this.app.destroy();
  }
}
