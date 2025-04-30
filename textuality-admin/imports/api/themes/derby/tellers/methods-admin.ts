import { Meteor } from 'meteor/meteor';

import Tellers from './tellers';
import { Teller, TellerId } from '/imports/schemas/derby/teller';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';
import { EventId } from '/imports/schemas/event';

Meteor.methods({
  'derby.tellers.new': async (teller: OptionalId<Teller>) => {
    const id = await Tellers.insertAsync(teller);
    return id;
  },

  'derby.tellers.update': async (teller: UpdateRequiredId<Teller>) => {
    await Tellers.updateAsync(teller._id, { $set: teller });
    return await Tellers.findOneAsync(teller._id);
  },

  'derby.tellers.upsert': async (teller: OptionalId<Teller>) => {
    if (!teller._id) {
      const id = await Tellers.insertAsync(teller);
      const insertedTeller = await Tellers.findOneAsync(id);
      return insertedTeller;
    } else {
      const id = teller._id;
      delete teller._id;
      await Tellers.updateAsync(id, { $set: teller });
      const updatedTeller = await Tellers.findOneAsync(id);
      return updatedTeller;
    }
  },

  'derby.tellers.duplicate': async (tellerId: TellerId) => {
    const teller = await Tellers.findOneAsync(tellerId);
    if (!teller) return;
    const newTeller: OptionalId<Teller> = { ...teller };
    delete newTeller._id;

    const urls = await Tellers.find(
      { event: teller.event },
      { fields: { url: 1 } },
    ).fetchAsync();

    let newUrl = teller.url + '-copy';
    let newUrlNumber = 1;
    while (urls.find((url) => url.url === newUrl)) {
      newUrl = teller.url + '-copy' + newUrlNumber;
      newUrlNumber++;
    }
    newTeller.url = newUrl;

    const id = await Tellers.insertAsync(newTeller);
    return id;
  },

  'derby.tellers.delete': async (tellerId: TellerId | TellerId[]) => {
    if (Array.isArray(tellerId)) {
      await Tellers.removeAsync({ _id: { $in: tellerId } });
    } else {
      await Tellers.removeAsync(tellerId);
    }
  },

  'derby.tellers.updateStatus': async (
    tellerId: TellerId,
    status: Teller['status'],
  ) => {
    await Tellers.updateAsync(tellerId, { $set: { status } });
    return await Tellers.findOneAsync(tellerId);
  },

  'derby.tellers.updateCurrentPlayer': async (
    tellerId: TellerId,
    playerId: Teller['current_player'],
  ) => {
    await Tellers.updateAsync(tellerId, { $set: { current_player: playerId } });
    return await Tellers.findOneAsync(tellerId);
  },

  'derby.tellers.updateCurrentBet': async (
    tellerId: TellerId,
    betId: Teller['current_bet'],
  ) => {
    await Tellers.updateAsync(tellerId, { $set: { current_bet: betId } });
    return await Tellers.findOneAsync(tellerId);
  },

  'derby.tellers.resetEvent': async (event_id: EventId) => {},
});
