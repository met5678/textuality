import { Meteor } from 'meteor/meteor';
import Events from '/imports/api/events';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { InText } from '/imports/schemas/inText';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { PlayerId } from '/imports/schemas/player';
import { tellerStartRaceBet } from '/imports/api/themes/derby/tellers/teller-flow/teller-start-bet';
import { raceBetAskType } from '/imports/api/themes/derby/raceBets/methods/raceBet.askType';
import RaceBets from '/imports/api/themes/derby/raceBets/raceBets';
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOnly,
} from '/imports/utils/capitalize-first-letter';
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

  // TODO: Check for fortune teller here.

  if (race.status === 'pre-bets' || race.status === 'future') {
    sendAutoText({
      trigger: 'TELLER_REJECT_BETTING_NOT_YET_OPEN',
      playerId: player._id,
    });
    return false;
  }

  if (!teller) {
    if (await Meteor.callAsync('derby.tellers.isNameInPool', tellerTextCode)) {
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
        teller_name: capitalizeFirstLetterOnly(teller.text_code),
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

  // TODO: Check does the player have enough for the minimum bet?
  const raceBetId = await Meteor.callAsync('derby.raceBets.startBet', {
    player_id: player._id,
    teller_id: teller._id,
    race_id: race._id,
  });

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
