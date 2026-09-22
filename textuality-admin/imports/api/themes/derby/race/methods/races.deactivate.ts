import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';

export const raceDeactivate = async (raceId: string, isFuture: boolean) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  Races.updateAsync(raceId, {
    $set: { status: isFuture ? 'future' : 'inactive' },
  });
};
