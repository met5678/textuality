import Races from '../races';

import { Meteor } from 'meteor/meteor';
import { keyframeIntervalHandles } from './_race-keyframe-interval';

export const raceResetTimeline = (raceId: string) => {
  if (keyframeIntervalHandles[raceId]) {
    Meteor.clearInterval(keyframeIntervalHandles[raceId]);
  }

  Races.updateAsync(raceId, {
    $set: {
      'timeline.current_frame': 0,
      'timeline.is_playing': false,
    },
  });
};
