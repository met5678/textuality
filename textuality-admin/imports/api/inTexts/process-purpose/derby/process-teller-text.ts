import { Meteor } from 'meteor/meteor';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { InText } from '/imports/schemas/inText';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { tellerStartRaceBet } from '/imports/api/themes/derby/tellers/teller-flow/teller-start-bet';
import { raceBetAskType } from '/imports/api/themes/derby/raceBets/methods/raceBet.askType';
import RaceBets from '/imports/api/themes/derby/raceBets/raceBets';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOnly,
} from '/imports/utils/capitalize-first-letter';
import {
  TELLER_FORTUNE_AVAILABLE_STATUSES,
  TELLER_FORTUNE_STATUSES,
} from '/imports/schemas/derby/teller-status/teller-status';
import { fortuneTellerCodeExists } from '/imports/api/themes/derby/tellers/fortune-teller-flow/teller.fortune.getCode';
import { raceBetStartBet } from '/imports/api/themes/derby/raceBets/methods/raceBet.startBet';
import { fortuneStartFortune } from '/imports/api/themes/derby/fortunes/methods/fortune.startFortune';
import { fortuneTellerEngageTeller } from '/imports/api/themes/derby/tellers/fortune-teller-flow/teller.fortune.engageTeller';
import { fortuneAskType } from '/imports/api/themes/derby/fortunes/methods/fortune.askType';

const processFortuneTeller = async (
  player: PlayerWithHelpers,
  tellerTextCode: string,
  teller?: TellerWithHelpers,
  race?: RaceWithHelpers,
) => {
  if (
    race?.status === 'pre-bets' &&
    teller &&
    TELLER_FORTUNE_AVAILABLE_STATUSES.includes(teller.status)
  ) {
    if (player.money < teller.min_wager) {
      sendAutoText({
        trigger: 'TELLER_REJECT_NOT_ENOUGH_MONEY',
        playerId: player._id,
        templateVars: {
          teller_name: capitalizeFirstLetterOnly(teller.text_code),
          min_wager: teller.min_wager,
        },
      });
      return true;
    }

    const fortune = await fortuneStartFortune({
      player_id: player._id,
      teller_id: teller._id,
    });
    if (!fortune) {
      throw new Error('Failed to start fortune');
    }
    fortuneAskType({
      fortune: fortune,
      player: player,
      teller: teller,
    });

    fortuneTellerEngageTeller(teller._id, fortune._id, player._id);
    return true;
  } else if (fortuneTellerCodeExists(tellerTextCode)) {
    sendAutoText({
      trigger: 'FORTUNE_TELLER_NOT_HERE_NOW',
      playerId: player._id,
      templateVars: {
        teller_name: capitalizeFirstLetterOnly(tellerTextCode),
      },
    });
    return true;
  }
  return false;
};

const doTellerPreChecks = async (
  race: RaceWithHelpers | undefined,
  teller: TellerWithHelpers | undefined,
  player: PlayerWithHelpers,
  tellerTextCode: string,
): Promise<boolean> => {
  if (!race || race.status === 'inactive') {
    sendAutoText({
      trigger: 'TELLER_REJECT_NO_RACES',
      playerId: player._id,
    });
    return false;
  }

  if (
    race.status === 'intro' ||
    race.status === 'active' ||
    race.status === 'results'
  ) {
    sendAutoText({
      trigger: 'TELLER_REJECT_RACE_ACTIVE',
      playerId: player._id,
    });
    return false;
  }

  const fortuneTellerProcessed = await processFortuneTeller(
    player,
    tellerTextCode,
    teller,
    race,
  );
  if (fortuneTellerProcessed) {
    return false;
  }

  if (race.status === 'pre-bets' || race.status === 'future') {
    sendAutoText({
      trigger: 'TELLER_REJECT_BETTING_NOT_YET_OPEN',
      playerId: player._id,
    });
    return false;
  }

  if (!teller) {
    if (Meteor.call('derby.tellers.isNameInPool', tellerTextCode)) {
      sendAutoText({
        trigger: 'TELLER_REJECT_NOT_HERE_NOW',
        playerId: player._id,
        templateVars: {
          teller_name: capitalizeFirstLetterOnly(tellerTextCode),
        },
      });
    } else {
      sendAutoText({
        trigger: 'TELLER_REJECT_NOT_EXIST',
        playerId: player._id,
        templateVars: {
          teller_name: capitalizeFirstLetter(tellerTextCode),
        },
      });
    }
    return false;
  }

  const existingRaceBet = await Meteor.callAsync(
    'derby.raceBets.getIncompleteBetForPlayer',
    {
      raceId: race._id,
      playerId: player._id,
      templateVars: {
        teller_name: capitalizeFirstLetterOnly(teller.text_code),
      },
    },
  );

  if (existingRaceBet) {
    sendAutoText({
      trigger: 'TELLER_REJECT_OTHER_BET_IN_PROGRESS',
      playerId: player._id,
      templateVars: {
        old_teller_name: capitalizeFirstLetterOnly(
          existingRaceBet.teller_text_code,
        ),
        new_teller_name: capitalizeFirstLetterOnly(teller.text_code),
      },
    });
    return false;
  }

  if (player.money < teller.min_wager) {
    sendAutoText({
      trigger: 'TELLER_REJECT_NOT_ENOUGH_MONEY',
      playerId: player._id,
      templateVars: {
        teller_name: capitalizeFirstLetterOnly(teller.text_code),
        min_wager: teller.min_wager,
      },
    });
    return false;
  }

  const raceBetId = await raceBetStartBet({
    player_id: player._id,
    teller_id: teller._id,
    race_id: race._id,
  });
  if (!raceBetId) {
    return false;
  }

  const raceBet = await RaceBets.findOneAsync(raceBetId);
  if (!raceBet) {
    throw new Error('RaceBet not found');
  }

  tellerStartRaceBet(teller._id, raceBetId, player._id);
  raceBetAskType({
    player,
    raceBet,
    teller,
    race,
  });

  return true;
};

export const processTellerText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  const tellerTextCode = inText.body.substring(1).trim();

  const race: RaceWithHelpers | undefined = await Meteor.callAsync(
    'derby.races.findCurrent',
  );

  const teller: TellerWithHelpers | undefined = await Meteor.callAsync(
    'derby.tellers.getForCode',
    tellerTextCode,
  );

  if (!(await doTellerPreChecks(race, teller, player, tellerTextCode))) {
    return;
  }
};
