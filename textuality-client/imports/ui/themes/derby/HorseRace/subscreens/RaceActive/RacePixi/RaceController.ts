import { Meteor } from 'meteor/meteor';
import { RaceCamera } from './RaceCamera/RaceCamera';
import { RaceHorse } from './RaceHorse/RaceHorse';
import { RaceTrack } from './RaceTrack/RaceTrack';
import {
  RaceId,
  RaceStatus,
  RaceTimeline,
  Weather,
} from '/imports/schemas/derby/race';
import { Tracker } from 'meteor/tracker';
import Horses from '/imports/api/themes/derby/horse';
import Races from '/imports/api/themes/derby/race';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { RaceTimelineHorseKeyframe } from '/imports/schemas/derby/race-timeline/types';
import { Dimensions } from './RacePixi.types';

export class RaceController {
  private raceId: RaceId = '';
  private horses: RaceHorse[] = [];
  private tracks: RaceTrack[] = [];
  private camera: RaceCamera;
  private dimensions: Dimensions = { width: 0, height: 0 };

  private furlong_length: number = 5;
  private weather: Weather = 'clear';
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

  constructor() {
    this.camera = new RaceCamera();
  }

  initRace(race: RaceWithHelpers) {
    if (this.raceId !== race._id) {
      this.raceId = race._id;
      this.setupSubscriptions();
    }
    this.mergeRace(race);
    console.log('initRace', { raceId: this.raceId });
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
        console.error('Race not found');
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
    this.weather = race.weather;
    this.furlong_length = race.furlong_length;
  }

  mergeHorses(horses: HorseWithHelpers[]) {
    const newHorseIds = horses.filter(
      (horse) => !this.horses.find((h) => h.id === horse._id),
    );

    this.horses = horses.map((horse) => new RaceHorse(horse));
    this.tracks = this.horses.map(
      (horse, index) => new RaceTrack(index, horse, this.furlong_length, this),
    );
  }

  mergeKeyframes(timeline: Pick<RaceTimeline, 'horses' | 'effects'>) {
    this.timeline.effects = timeline.effects;
    this.timeline.horses = timeline.horses;
  }

  updatePlayback(playback: Pick<RaceTimeline, 'current_frame' | 'is_playing'>) {
    this.timeline.current_frame = playback.current_frame;
    this.timeline.is_playing = playback.is_playing;
  }

  setSize(width: number, height: number) {
    this.dimensions.width = width;
    this.dimensions.height = height;
  }

  getDimensions(): Dimensions {
    return this.dimensions;
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

  getNumHorses(): number {
    return this.horses.length;
  }

  destroy() {
    this.subscriptions.horses?.stop();
    this.subscriptions.horses = null;
  }
}
