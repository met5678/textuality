import { Meteor } from 'meteor/meteor';

import RaceBets from './raceBets';
import { RaceBetId } from '../../../../schemas/derby/raceBet';

Meteor.methods({
  'derby.raceBets.delete': async (betId: RaceBetId | RaceBetId[]) => {
    if (Array.isArray(betId)) {
      await RaceBets.removeAsync({ _id: { $in: betId } });
    } else {
      await RaceBets.removeAsync(betId);
    }
  },

  'derby.raceBets.clearRace': async (race_id: string) => {
    await RaceBets.removeAsync({ race: race_id });
  },

  'derby.raceBets.resetEvent': async (event_id: string) => {
    await RaceBets.removeAsync({ event: event_id });
  },
});
