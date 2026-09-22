import { KEYFRAME_INTERVAL_SECONDS } from '../timeline/generate-timeline';

import Races from '..';

import { RaceId } from '/imports/schemas/derby/race';
import { Meteor } from 'meteor/meteor';
import { keyframeIntervalHandles } from './_race-keyframe-interval';

export const raceStartTimeline = async (
  raceId: RaceId,
  resume: boolean = false,
) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

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
};
