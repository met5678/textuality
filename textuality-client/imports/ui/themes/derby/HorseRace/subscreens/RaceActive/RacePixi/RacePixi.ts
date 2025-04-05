import { Application } from 'pixi.js';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import RaceTrackPixi from './RaceTrack/RaceTrackPixi';
import RaceHorsePixi from './RaceHorse/RaceHorsePixi';

export class RacePixi {
  private app!: Application;

  private tracks: RaceTrackPixi[] = [];
  private horses: RaceHorsePixi[] = [];

  constructor(raceWithHelpers: RaceWithHelpers) {}

  public async init(wrapper: HTMLDivElement) {
    this.app = new Application();
    await this.app.init({
      resizeTo: wrapper,
    });
    wrapper.appendChild(this.app.canvas);

    this.horses.push(new RaceHorsePixi(this.app));
    this.tracks.push(new RaceTrackPixi(this.horses[0]));
  }
}
