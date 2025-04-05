import { Meteor } from 'meteor/meteor';
import { RaceCamera } from './RaceCamera/RaceCamera';
import { RaceHorse } from './RaceHorse/RaceHorse';
import { RaceTrack } from './RaceTrack/RaceTrack';
import {
  RaceId,
  RaceStatus,
  RaceTimeline,
  TrackCondition,
} from '/imports/schemas/derby/race';
import { Tracker } from 'meteor/tracker';
import Horses from '/imports/api/themes/derby/horse';
import Races from '/imports/api/themes/derby/race';
import { HorseWithHelpers } from '/imports/api/themes/derby/horse/horses';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';

export class RaceController {
  private raceId: RaceId;
  private horses: RaceHorse[] = [];
  private tracks: RaceTrack[] = [];
  private camera: RaceCamera;
  private condition: TrackCondition;
  private timeline: RaceTimeline;
  private status: RaceStatus;

  private subscriptions: {
    horses: Meteor.SubscriptionHandle | null;
    race: Meteor.SubscriptionHandle | null;
  } = {
    horses: null,
    race: null,
  };

  constructor(raceWithHelpers: RaceWithHelpers) {
    this.raceId = raceWithHelpers._id;
    this.camera = new RaceCamera();
    this.mergeRace(raceWithHelpers);
  }

  setupSubscriptions() {
    this.subscriptions.horses = Meteor.subscribe('horses', this.raceId);
    Tracker.autorun(async (computation) => {
      const race = await Races.findOneAsync({ _id: this.raceId });
      if (!race) {
        throw new Error('Race not found');
      }
      const horses = await Tracker.withComputation(computation, () =>
        Horses.find({ _id: { $in: race.horses } }).fetchAsync(),
      );
      this.mergeRace(race);
      this.mergeHorses(horses);
    });
  }

  mergeRace(race: RaceWithHelpers) {
    this.status = race.status;
    this.condition = race.track_condition;
    this.timeline = race.timeline;
  }

  mergeHorses(horses: HorseWithHelpers[]) {
    const newHorseIds = horses.filter(
      (horse) => !this.horses.find((h) => h.id === horse._id),
    );

    this.horses = horses.map((horse) => new RaceHorse(horse));
  }

  destroy() {
    this.subscriptions.horses?.stop();
    this.subscriptions.horses = null;
  }
}
