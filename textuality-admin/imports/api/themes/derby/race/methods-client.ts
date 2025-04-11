import { Meteor } from 'meteor/meteor';

import Races from './races';
import { RaceId } from '/imports/schemas/derby/race';
import { generateTimelineWithResults } from './timeline/generate-timeline';
import Horses from '../horse/horses';

Meteor.methods({
  'derby.races.generateTimeline': (raceId: RaceId, seed?: number) => {
    const race = Races.findOne(raceId);
    if (!race) {
      throw new Meteor.Error('race-not-found', 'Race not found');
    }
    const horses = Horses.find({ _id: { $in: race.horses } }).fetch();

    const { timeline, results } = generateTimelineWithResults(
      race,
      horses,
      seed,
    );

    console.log({ results, timeline });

    Races.update(raceId, { $set: { timeline, results } });
  },
});
