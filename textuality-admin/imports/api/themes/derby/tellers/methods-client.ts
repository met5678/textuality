import { Meteor } from 'meteor/meteor';
import Tellers from './tellers';
import Events from '/imports/api/events';
import { TellerStatus } from '/imports/schemas/derby/teller';

const BUSY_STATUSES: TellerStatus[] = [
  'betting',
  'betting-impatient',
  'giving-stub-single',
  'giving-stub-multi',
  'timeout',
];
const CLOSED_STATUSES: TellerStatus[] = [
  'closing',
  'break',
  'standup',
  'sitdown',
  'empty',
  'opening',
];
const OPEN_STATUSES: TellerStatus[] = ['open'];

const VIDEO_LENGTHS: Record<TellerStatus, number> = {
  opening: 5,
  open: -1,
  betting: -1,
  'betting-impatient': -1,
  timeout: 3,
  'giving-stub-single': 4,
  'giving-stub-multi': 4,
  closing: 5,

  break: -1,
  standup: 5,
  empty: -1,
  sitdown: 10,
};

Meteor.methods({
  'derby.tellers.getForCode': async (code: string) => {
    const teller = await Tellers.findOneAsync({
      event: Events.currentIdOrThrow(),
      text_code: code,
    });
    return teller;
  },

  'derby.tellers.open': async (teller_id: string) => {
    const teller = await Tellers.findOneAsync(teller_id);
    if (!teller) {
      throw new Meteor.Error('teller-not-found', 'Teller not found');
    }

    if (teller.status !== 'closed') {
      throw new Meteor.Error('teller-not-closed', 'Teller is not closed');
    }

    await Tellers.updateAsync(teller_id, { $set: { status: 'open' } });
  },

  'derby.tellers.tryStartBet': async ({
    teller_id,
    player_id,
  }: {
    teller_id: string;
    player_id: string;
  }) => {
    const teller = await Tellers.findOneAsync(teller_id);
    if (!teller) {
      return;
    }
    if (BUSY_STATUSES.includes(teller.status)) {
      Meteor.callAsync('autoTexts.send', {
        trigger: 'TELLER_BUSY',
        playerId: player_id,
        templateVars: {},
      });
      return;
    }

    if (CLOSED_STATUSES.includes(teller.status)) {
      Meteor.callAsync('autoTexts.send', {
        trigger: 'TELLER_CLOSED_RACE_ACTIVE',
        playerId: player_id,
        templateVars: {},
      });
    }

    if (!teller) {
      throw new Meteor.Error('teller-not-found', 'Teller not found');
    }
  },
});
