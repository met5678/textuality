import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';

export const raceStartPreBets = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  const defaultOdds = race.horses.map((horse) => ({
    horse,
    odds: race.horses.length,
  }));

  Races.updateAsync(raceId, {
    $set: { status: 'pre-bets', odds: defaultOdds },
  });
};
