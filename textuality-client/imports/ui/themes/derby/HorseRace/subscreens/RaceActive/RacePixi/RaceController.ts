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

export class RaceController {
  private raceId: RaceId = '';
  private horses: RaceHorse[] = [];
  private tracks: RaceTrack[] = [];
  private screenSize: Dimensions = { width: 0, height: 0 };
  private ticker: Ticker;
  private _tickerUpdate: () => void;
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

  private subscriptions: {
    horses: Meteor.SubscriptionHandle | null;
  } = {
    horses: null,
  };

  constructor(ticker: Ticker) {
    this.ticker = ticker;
    this._tickerUpdate = this.update.bind(this);
    this.ticker.add(this._tickerUpdate);
    this.viewport = new RaceViewport(this);
  }

  initRace(race: RaceWithHelpers) {
    if (this.raceId !== race._id) {
      this.raceId = race._id;
      this.mergeRace(race);
      this.setupSubscriptions();
    } else {
      this.mergeRace(race);
    }
  }

  async setupSubscriptions() {
    this.subscriptions.horses?.stop();
    this.subscriptions.horses = Meteor.subscribe('horses.all', this.raceId);

    Tracker.autorun(async (computation) => {
      const race = await Races.findOneAsync(this.raceId, {
        fields: {
          horses: 1,
        },
      });
      if (!race) {
        console.warn('Race not found');
        return;
      }
      const horses = await Tracker.withComputation(computation, () =>
        Horses.find({ _id: { $in: race.horses } }).fetchAsync(),
      );
      this.mergeHorses(horses);
    });

    // Timeline keyframes subscription
    Tracker.autorun(async (computation) => {
      const race = await Races.findOneAsync(this.raceId, {
        fields: {
          'timeline.horses': 1,
          'timeline.effects': 1,
        },
      });
      if (!race) {
        return;
      }
      this.mergeKeyframes({
        effects: race.timeline.effects,
        horses: race.timeline.horses,
      });
    });

    // Timeline playback subscription
    Tracker.autorun(async (computation) => {
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
    });
  }

  mergeRace(race: RaceWithHelpers) {
    console.log('mergeRace', { race });
    this.weather = race.weather;
    this.furlong_length = race.furlong_length;
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
        raceHorse.setKeyframes(this.timeline.horses[horse._id]);
      } else {
        raceHorse.setHorse(horse);
      }
    });

    this.tracks.length = this.horses.length;
  }

  mergeKeyframes(timeline: Pick<RaceTimeline, 'horses' | 'effects'>) {
    this.timeline.effects = timeline.effects;
    this.timeline.horses = timeline.horses;

    this.horses.forEach((horse) => {
      horse.setKeyframes(this.timeline.horses[horse.id]);
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

    this.viewport.update(this.horses, this.furlong_length);
  }

  destroy() {
    this.subscriptions.horses?.stop();
    this.subscriptions.horses = null;
    this.viewport.destroy();
    this.ticker.remove(this._tickerUpdate);
  }
}
