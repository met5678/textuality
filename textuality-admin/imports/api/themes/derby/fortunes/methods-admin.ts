import { Meteor } from 'meteor/meteor';

import { FortuneId } from '/imports/schemas/derby/fortune';
import Fortunes from './fortunes';

Meteor.methods({
  'derby.fortunes.delete': async (fortuneId: FortuneId | FortuneId[]) => {
    if (Array.isArray(fortuneId)) {
      await Fortunes.removeAsync({ _id: { $in: fortuneId } });
    } else {
      await Fortunes.removeAsync(fortuneId);
    }
  },

  'derby.fortunes.resetEvent': async (event_id: string) => {
    await Fortunes.removeAsync({ event: event_id });
  },
});
