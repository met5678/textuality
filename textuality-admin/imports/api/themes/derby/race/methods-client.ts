import { Meteor } from 'meteor/meteor';

import Races, { RaceWithHelpers } from './races';
import { RaceId } from '/imports/schemas/derby/race';
import {
  generateTimelineWithResults,
  KEYFRAME_INTERVAL_SECONDS,
} from './timeline/generate-timeline';
import Horses from '../horses/horses';
import Events from '/imports/api/events';
import { racesGetCurrent } from './methods/races.getCurrent';
import { raceDoPayouts } from './methods/races.doPayouts';
const keyframeIntervalHandles: Record<RaceId, number> = {};

Meteor.methods({
  'derby.races.findCurrent': async (): Promise<RaceWithHelpers | undefined> => {
    return racesGetCurrent();
  },

  'derby.races.generateTimeline': async (raceId: RaceId, seed?: number) => {
    const race = await Races.findOneAsync(raceId);
    if (!race) {
      throw new Meteor.Error('race-not-found', 'Race not found');
    }
    const horses = Horses.find({ _id: { $in: race.horses } }).fetch();

    const { timeline, results } = generateTimelineWithResults(
      race,
      horses,
      seed,
    );

    Races.updateAsync(raceId, { $set: { timeline, results } });
  },

  'derby.races.startRace': async (raceId: RaceId, resume: boolean = false) => {
    const race = await Races.findOneAsync(raceId);
    if (!race) {
      throw new Meteor.Error('derby.races.startRace', 'Race not found');
    }

    Meteor.clearInterval(keyframeIntervalHandles[raceId]);

    const timeline = race.timeline;
    const startFrame = resume ? timeline.current_frame : 0;

    let maxFrame = 0;
    for (const horseKeyframes of Object.values(timeline.horses)) {
      maxFrame = Math.max(maxFrame, horseKeyframes.length - 1);
    }

    await Races.updateAsync(raceId, {
      $set: {
        status: 'active',
        'timeline.current_frame': startFrame,
        'timeline.is_playing': true,
      },
    });

    keyframeIntervalHandles[raceId] = Meteor.setInterval(async () => {
      await Races.updateAsync(raceId, {
        $inc: { 'timeline.current_frame': KEYFRAME_INTERVAL_SECONDS },
      });
      const race = await Races.findOneAsync(raceId, {
        fields: { 'timeline.current_frame': 1 },
      });
      if (!race || !race.timeline) {
        Meteor.clearInterval(keyframeIntervalHandles[raceId]);
        return;
      }
      if (race.timeline.current_frame >= maxFrame) {
        Meteor.clearInterval(keyframeIntervalHandles[raceId]);
        await Races.updateAsync(raceId, {
          $set: { 'timeline.is_playing': false },
        });
      }
    }, KEYFRAME_INTERVAL_SECONDS * 1000);
  },

  'derby.races.pauseRace': async (raceId: RaceId) => {
    Meteor.clearInterval(keyframeIntervalHandles[raceId]);
    Races.updateAsync(raceId, { $set: { 'timeline.is_playing': false } });
  },

  'derby.races.seekToFrame': async (raceId: RaceId, frame: number) => {
    const race = await Races.findOneAsync(raceId);
    if (!race) {
      throw new Meteor.Error('race-not-found', 'Race not found');
    }
    Races.updateAsync(raceId, { $set: { 'timeline.current_frame': frame } });
  },

  'derby.races.stopRace': async (raceId: RaceId) => {
    const race = await Races.findOneAsync(raceId);
    if (!race) {
      throw new Meteor.Error('race-not-found', 'Race not found');
    }
    Meteor.clearInterval(keyframeIntervalHandles[raceId]);
    Races.updateAsync(raceId, {
      $set: {
        status: 'active',
        'timeline.current_frame': 0,
        'timeline.is_playing': false,
      },
    });
  },

  'derby.races.doPayouts': async (raceId: RaceId) => {
    raceDoPayouts(raceId);
  },
});
