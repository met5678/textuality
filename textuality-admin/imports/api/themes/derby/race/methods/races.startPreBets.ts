import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';
import { raceResetTimeline } from './races.resetTimeline';
export const raceStartPreBets = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  const defaultOdds = race.horses.map((horse) => ({
    horse,
    odds: race.horses.length,
  }));

  raceResetTimeline(raceId);
  Races.updateAsync(raceId, {
    $set: { status: 'pre-bets', odds: defaultOdds },
  });
};
