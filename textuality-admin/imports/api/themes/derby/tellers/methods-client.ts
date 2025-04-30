import { Meteor } from 'meteor/meteor';
import Tellers from './tellers';
import Events from '/imports/api/events';
import {
  TELLER_CLOSED_STATUSES,
  TELLER_BUSY_STATUSES,
} from '/imports/schemas/derby/teller-status/teller-status';
import { TellerId } from '/imports/schemas/derby/teller';
import { maleDogNames } from '/imports/utils/male-dog-names';
import { RaceBetId } from '/imports/schemas/derby/raceBet';
import { PlayerId } from '/imports/schemas/player';
import { openTeller } from './teller-flow/teller-open';
import { tellerStartRaceBet } from './teller-flow/teller-start-bet';
import { closeTeller } from './teller-flow/teller-close';
import { standupTeller } from './teller-flow/teller-standup';
import { sitdownTeller } from './teller-flow/teller-sitdown';
import { tellerUpdateBet } from './teller-flow/teller-update-bet';
import { tellerCancelBet } from './teller-flow/teller-cancel-bet';
import { tellerCompleteBet } from './teller-flow/teller-complete-bet';

const getRandomTextCode = () => {
  return maleDogNames[Math.floor(Math.random() * maleDogNames.length)];
};

Meteor.methods({
  'derby.tellers.getForCode': async (code: string) => {
    const teller = await Tellers.findOneAsync({
      event: Events.currentIdOrThrow(),
      text_code: { $regex: new RegExp(`^${code}$`, 'i') },
    });
    return teller;
  },

  'derby.tellers.open': async (teller_id: string) => {
    console.log('derby.tellers.open', teller_id);
    try {
      openTeller(teller_id);
    } catch (error) {
      throw error;
    }
  },

  'derby.tellers.startBet': async (
    teller_id: TellerId,
    bet_id: RaceBetId,
    player_id: PlayerId,
  ) => {
    tellerStartRaceBet(teller_id, bet_id, player_id);
  },

  'derby.tellers.updateBet': async (teller_id: TellerId, bet_id: RaceBetId) => {
    tellerUpdateBet(teller_id, bet_id);
  },

  'derby.tellers.completeBet': async (
    teller_id: TellerId,
    bet_id: RaceBetId,
  ) => {
    tellerCompleteBet(teller_id, bet_id);
  },

  'derby.tellers.cancelBet': async (teller_id: TellerId, bet_id: RaceBetId) => {
    tellerCancelBet(teller_id, bet_id);
  },

  'derby.tellers.close': async (teller_id: TellerId) => {
    closeTeller(teller_id);
  },

  'derby.tellers.standup': async (teller_id: string) => {
    standupTeller(teller_id);
  },

  'derby.tellers.sitdown': async (teller_id: string) => {
    sitdownTeller(teller_id);
  },

  'derby.tellers.getAvailableTextCode': async () => {
    const tellerCodes = await Tellers.find(
      { event: Events.currentIdOrThrow() },
      { fields: { text_code: 1 } },
    ).mapAsync((teller) => teller.text_code);

    let newCode = '';
    do {
      newCode = getRandomTextCode();
    } while (tellerCodes.includes(newCode));

    return newCode;
  },

  'derby.tellers.isNameInPool': (name: string) => {
    return maleDogNames.some((n) => n.toLowerCase() === name.toLowerCase());
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
    if (TELLER_BUSY_STATUSES.includes(teller.status)) {
      Meteor.callAsync('autoTexts.send', {
        trigger: 'TELLER_BUSY',
        playerId: player_id,
        templateVars: {},
      });
      return;
    }

    if (TELLER_CLOSED_STATUSES.includes(teller.status)) {
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
