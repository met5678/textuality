import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';
import { raceResetTimeline } from './races.resetTimeline';

export const raceOpenBets = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  raceResetTimeline(raceId);
  Races.updateAsync(raceId, { $set: { status: 'bets-open' } });
};
