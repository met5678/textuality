import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';
import { raceDoPayouts } from './races.doPayouts';
import { raceResetTimeline } from './races.resetTimeline';

export const raceStartResults = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  await raceDoPayouts(raceId);

  Races.updateAsync(raceId, { $set: { status: 'results' } });
  raceResetTimeline(raceId);
};
