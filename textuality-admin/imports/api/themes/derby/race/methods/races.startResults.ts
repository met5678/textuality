import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';

export const raceStartResults = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  Races.updateAsync(raceId, { $set: { status: 'results' } });
};
