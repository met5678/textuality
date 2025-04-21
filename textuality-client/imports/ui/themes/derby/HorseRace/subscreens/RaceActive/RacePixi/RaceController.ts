import { Meteor } from 'meteor/meteor';
import { RaceHorse } from './RaceHorse/RaceHorse';
import { RaceTrack } from './RaceTrack/RaceTrack';
import { RaceViewport } from './RaceViewport/RaceViewport';
import {
  RaceHorseResult,
  RaceId,
  RaceTimeline,
  Weather,
} from '/imports/schemas/derby/race';
import { Tracker } from 'meteor/tracker';
import Horses from '/imports/api/themes/derby/horses';
import Races from '/imports/api/themes/derby/race';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { Dimensions } from './RacePixi.types';
import { Ticker } from 'pixi.js';
import { RaceTrackBanner } from './RaceResultBanner/RaceResultBanner';

export class RaceController {
  private raceId: RaceId = '';

  private horses: RaceHorse[] = [];
  private tracks: RaceTrack[] = [];
  private resultBanners: RaceTrackBanner[] = [];

  private screenSize: Dimensions = { width: 0, height: 0 };

  private ticker: Ticker;
  private _timeAtLastFrameUpdate: number = 0;
  private _timeInterpolated: number = 0;

  private furlong_length: number = 5;
  private weather: Weather = 'clear';
  private viewport: RaceViewport;
  private timeline: RaceTimeline = {
    horses: {},
    effects: {},
    current_frame: 0,
    is_playing: false,
  };
  private results: RaceHorseResult[] = [];

  private _dirtyFlag: boolean = false;

  public get isDirty(): boolean {
    return this._dirtyFlag;
  }

  private _subscriptions: {
    horses: Meteor.SubscriptionHandle | null;
  } = {
    horses: null,
  };
  private _autorunHandles: Tracker.Computation[] = [];

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
    this._subscriptions.horses?.stop();
    this._subscriptions.horses = Meteor.subscribe(
      'derby.horses.all',
      this.raceId,
    );

    this._autorunHandles.forEach((handle) => handle.stop());
    this._autorunHandles = [];

    let autorunSubhandles: Tracker.Computation[] = [];

    this._autorunHandles.push(
      Tracker.autorun(async (computation) => {
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

        this.mergeRace(race, horses);

        // Stop the previous autoruns
        autorunSubhandles.forEach((handle) => {
          handle.stop();
        });
        autorunSubhandles = [];

        // Timeline keyframes/results subscription
        autorunSubhandles.push(
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
            this.mergeKeyframesAndResults(
              {
                effects: race.timeline.effects,
                horses: race.timeline.horses,
              },
              race.results,
            );
          }),
        );

        // Timeline playback subscription
        autorunSubhandles.push(
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

        this._autorunHandles.push(...autorunSubhandles);
      }),
    );
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
        const result = this.results.find((r) => r.horse === horse._id);
        if (result) {
          raceHorse.setResult(result);
        }
      }

      let resultBanner = this.resultBanners[index];
      if (!resultBanner) {
        resultBanner = new RaceTrackBanner(this, raceTrack, raceHorse);
        this.resultBanners.push(resultBanner);
      }
    });

    this.tracks.length = this.horses.length;
  }

  mergeKeyframesAndResults(
    timeline: Pick<RaceTimeline, 'horses' | 'effects'>,
    results: RaceHorseResult[],
  ) {
    this.timeline.effects = timeline.effects;
    this.timeline.horses = timeline.horses;
    this.results = results;

    this.horses.forEach((horse) => {
      const horseKeyframes = this.timeline.horses[horse.id];
      if (horseKeyframes) {
        horse.setKeyframes(horseKeyframes);
      }
      const result = this.results.find((r) => r.horse === horse.id);
      if (result) {
        horse.setResult(result);
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

  getResultBanners(): RaceTrackBanner[] {
    return this.resultBanners;
  }

  getNumHorses(): number {
    return this.horses.length;
  }

  getViewport(): RaceViewport {
    return this.viewport;
  }

  getTime(): number {
    if (this.timeline.is_playing) {
      return this._timeInterpolated;
    } else {
      return this.timeline.current_frame;
    }
  }

  getRaceProgress(): number {
    const time = this.getTime();
    let fastestFinish = 200;
    for (const horseResult of this.results) {
      fastestFinish = Math.min(fastestFinish, horseResult.time);
    }
    return time / fastestFinish;
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

    this._timeInterpolated = time;

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
    this._autorunHandles.forEach((handle) => handle.stop());
    this._subscriptions.horses?.stop();
  }
}
