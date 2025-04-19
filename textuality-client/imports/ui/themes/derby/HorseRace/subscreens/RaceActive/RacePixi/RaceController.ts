import { Meteor } from 'meteor/meteor';
import { RaceHorse } from './RaceHorse/RaceHorse';
import { RaceTrack } from './RaceTrack/RaceTrack';
import { RaceViewport } from './RaceViewport/RaceViewport';
import { RaceId, RaceTimeline, Weather } from '/imports/schemas/derby/race';
import { Tracker } from 'meteor/tracker';
import Horses from '/imports/api/themes/derby/horses';
import Races from '/imports/api/themes/derby/race';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { Dimensions } from './RacePixi.types';
import { Ticker } from 'pixi.js';
import { RaceTrackResultBanner } from './RaceTrack/RaceTrackResultBanner';

export class RaceController {
  private raceId: RaceId = '';
  private race: RaceWithHelpers | null = null;
  private horses: RaceHorse[] = [];
  private tracks: RaceTrack[] = [];
  private resultBanners: RaceTrackResultBanner[] = [];
  private screenSize: Dimensions = { width: 0, height: 0 };
  private ticker: Ticker;
  private _timeAtLastFrameUpdate: number = 0;
  private furlong_length: number = 5;
  private weather: Weather = 'clear';
  private viewport: RaceViewport;
  private timeline: RaceTimeline = {
    horses: {},
    effects: {},
    current_frame: 0,
    is_playing: false,
  };

  private _subscriptions: {
    horses: Meteor.SubscriptionHandle | null;
  } = {
    horses: null,
  };
  private _autorunHandle: Tracker.Computation | null = null;

  constructor(ticker: Ticker) {
    this.ticker = ticker;
    this.ticker.add(this.update, this);
    this.viewport = new RaceViewport(this);
  }

  initRace(race: RaceWithHelpers) {
    if (this.raceId !== race._id) {
      this.raceId = race._id;
      this.setupReactions();
    }
  }

  async setupReactions() {
    console.log('Setup reactions');
    this._subscriptions.horses?.stop();
    this._subscriptions.horses = Meteor.subscribe('horses.all', this.raceId);

    this._autorunHandle?.stop();

    let subhandles: Tracker.Computation[] = [];

    this._autorunHandle = Tracker.autorun(async (computation) => {
      const race = await Races.findOneAsync(this.raceId, {
        fields: {
          timeline: 0,
          results: 0,
        },
      });
      if (!race) {
        console.warn('Race not found');
        return;
      }

      const horses = await Tracker.withComputation(computation, () =>
        Horses.find({ _id: { $in: race.horses } }).fetchAsync(),
      );

      if (race.horses.length != horses.length) {
        console.warn('Race horses length mismatch', {
          raceHorses: race.horses,
          horses,
        });
        return;
      }

      console.log('Here', race, horses);

      this.mergeRace(race, horses);

      subhandles.forEach((handle) => {
        handle.stop();
      });
      subhandles = [];

      // Timeline keyframes/results subscription
      subhandles.push(
        Tracker.autorun(async () => {
          console.log('Timeline');

          const race = await Races.findOneAsync(this.raceId, {
            fields: {
              'timeline.horses': 1,
              'timeline.effects': 1,
              results: 1,
            },
          });
          if (!race || !race.timeline) {
            return;
          }
          this.mergeKeyframes({
            effects: race.timeline.effects,
            horses: race.timeline.horses,
          });
        }),
      );

      // Timeline playback subscription
      subhandles.push(
        Tracker.autorun(async () => {
          console.log('Timeline Playback Autorun');

          const race = await Races.findOneAsync(this.raceId, {
            fields: {
              'timeline.current_frame': 1,
              'timeline.is_playing': 1,
            },
          });
          if (!race) {
            return;
          }
          this.updatePlayback({
            current_frame: race.timeline.current_frame,
            is_playing: race.timeline.is_playing,
          });
        }),
      );
    });
  }

  mergeRace(race: RaceWithHelpers, horses: HorseWithHelpers[]) {
    this.weather = race.weather;
    this.furlong_length = race.furlong_length;
    this.mergeHorses(horses);
  }

  mergeHorses(horses: HorseWithHelpers[]) {
    horses.forEach((horse, index) => {
      let raceTrack = this.tracks[index];
      if (!raceTrack) {
        raceTrack = new RaceTrack(index, this.furlong_length, this);
        this.tracks.push(raceTrack);
      }

      let raceHorse = this.horses[index];
      if (!raceHorse) {
        raceHorse = new RaceHorse(index, horse, raceTrack, this);
        this.horses.push(raceHorse);
      } else {
        raceHorse.setHorse(horse);
        const result = this.race?.results.find((r) => r.horse === horse._id);
        if (result) {
          raceHorse.setResult(result);
        }
      }

      const resultBanner = new RaceTrackResultBanner(
        this,
        raceTrack,
        raceHorse,
      );
      this.resultBanners.push(resultBanner);
    });

    this.tracks.length = this.horses.length;
  }

  mergeKeyframes(timeline: Pick<RaceTimeline, 'horses' | 'effects'>) {
    this.timeline.effects = timeline.effects;
    this.timeline.horses = timeline.horses;

    this.horses.forEach((horse) => {
      const horseKeyframes = this.timeline.horses[horse.id];
      if (horseKeyframes) {
        horse.setKeyframes(horseKeyframes);
      }
    });
  }

  updatePlayback(playback: Pick<RaceTimeline, 'current_frame' | 'is_playing'>) {
    this.timeline.current_frame = playback.current_frame;
    this.timeline.is_playing = playback.is_playing;
    this._timeAtLastFrameUpdate = Date.now() / 1000;
  }

  setSize(width: number, height: number) {
    this.screenSize.width = width;
    this.screenSize.height = height;
  }

  getDimensions(): Dimensions {
    return this.screenSize;
  }

  getTrackData(): Pick<RaceWithHelpers, 'weather' | 'furlong_length'> {
    return {
      weather: this.weather,
      furlong_length: this.furlong_length,
    };
  }

  getTracks(): RaceTrack[] {
    return this.tracks;
  }

  getHorses(): RaceHorse[] {
    return this.horses;
  }

  getResultBanners(): RaceTrackResultBanner[] {
    return this.resultBanners;
  }

  getNumHorses(): number {
    return this.horses.length;
  }

  getViewport(): RaceViewport {
    return this.viewport;
  }

  update() {
    let time = 0;
    if (this.timeline.is_playing) {
      time =
        this.timeline.current_frame +
        (Date.now() / 1000 - this._timeAtLastFrameUpdate);
    } else {
      time = this.timeline.current_frame;
    }

    this.horses.forEach((horse) => {
      horse.update(time);
    });

    this.resultBanners.forEach((resultBanner) => {
      resultBanner.update(time);
    });

    this.viewport.update(this.horses, this.furlong_length);
  }

  destroy() {
    this.ticker.remove(this.update, this);
    this._subscriptions.horses?.stop();
    this._subscriptions.horses = null;
    this.viewport.destroy();
  }
}
