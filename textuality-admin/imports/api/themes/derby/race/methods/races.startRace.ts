import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';
import Horses from '/imports/api/themes/derby/horses';
import { raceGenerateTimeline } from './races.generateTimeline';

export const raceStartRace = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  const horses = await Horses.find(
    { _id: { $in: race.horses } },
    { sort: { number: 1 } },
  ).fetch();

  if (!race.linked_mission) {
    console.log('no linked mission, generating timeline');
    await raceGenerateTimeline(raceId);
  } else {
    console.log('linked mission, not generating timeline');
  }

  Races.updateAsync(raceId, { $set: { status: 'active' } });
};
