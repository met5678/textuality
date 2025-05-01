import { Meteor } from 'meteor/meteor';
import Races from '/imports/api/themes/derby/race';
import { generateTimelineWithResults } from '../timeline/generate-timeline';
import Horses from '/imports/api/themes/derby/horses';

export const raceStartRace = async (raceId: string) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) throw new Meteor.Error('race-not-found', 'Race not found');

  const horses = await Horses.find(
    { _id: { $in: race.horses } },
    { sort: { number: 1 } },
  ).fetch();

  const { timeline, results } = generateTimelineWithResults(race, horses);

  Races.updateAsync(raceId, { $set: { status: 'active', timeline, results } });
};
