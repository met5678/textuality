import { Meteor } from 'meteor/meteor';

import RaceBets from './raceBets';
import { RaceBet, RaceBetId } from '../../../../schemas/derby/raceBet';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';

Meteor.methods({
  'derby.raceBets.new': async (bet: OptionalId<RaceBet>) => {
    const id = await RaceBets.insertAsync(bet);
    return id;
  },

  'derby.raceBets.update': async (bet: UpdateRequiredId<RaceBet>) => {
    await RaceBets.updateAsync(bet._id, { $set: bet });
    return await RaceBets.findOneAsync(bet._id);
  },

  'derby.raceBets.upsert': async (bet: OptionalId<RaceBet>) => {
    if (!bet._id) {
      const id = await RaceBets.insertAsync(bet);
      const insertedBet = await RaceBets.findOneAsync(id);
      return insertedBet;
    } else {
      const id = bet._id;
      delete bet._id;
      await RaceBets.updateAsync(id, { $set: bet });
      const updatedBet = await RaceBets.findOneAsync(id);
      return updatedBet;
    }
  },

  'derby.raceBets.delete': async (betId: RaceBetId | RaceBetId[]) => {
    if (Array.isArray(betId)) {
      await RaceBets.removeAsync({ _id: { $in: betId } });
    } else {
      await RaceBets.removeAsync(betId);
    }
  },

  'derby.raceBets.updateStatus': async (
    betId: RaceBetId,
    status: RaceBet['status'],
  ) => {
    await RaceBets.updateAsync(betId, { $set: { status } });
    return await RaceBets.findOneAsync(betId);
  },

  'derby.raceBets.updateStep': async (
    betId: RaceBetId,
    step: RaceBet['step'],
  ) => {
    await RaceBets.updateAsync(betId, { $set: { step } });
    return await RaceBets.findOneAsync(betId);
  },
});
