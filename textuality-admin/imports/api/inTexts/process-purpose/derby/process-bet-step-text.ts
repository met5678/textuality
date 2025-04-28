import { InText } from '/imports/schemas/inText';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { RaceBet } from '/imports/schemas/derby/raceBet';
import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import RaceBets from '/imports/api/themes/derby/raceBets';
import Tellers from '/imports/api/themes/derby/tellers';
import Races from '/imports/api/themes/derby/race';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import Horses from '/imports/api/themes/derby/horses';
import { HorseWithHelpers } from '/imports/api/themes/derby/horses/horses';
import { updateBet } from '/imports/api/themes/derby/tellers/teller-flow/teller-update-bet';
import { raceBetProcessBetType } from '/imports/api/themes/derby/raceBets/methods/raceBet.processBetType';
import { raceBetProcessHorse } from '/imports/api/themes/derby/raceBets/methods/raceBet.processHorse';

export const processBetStepText = async (
  inText: InText,
  player: PlayerWithHelpers,
) => {
  if (!inText.interactive) {
    return;
  }
  const [, raceBetId, step, value] = inText.interactive.value.split('/') ?? [];

  const raceBet = await RaceBets.findOneAsync(raceBetId);

  if (!raceBet) {
    throw new Error('Race bet not found, this should not happen');
  }

  if (step !== raceBet.step) {
    sendAutoText({
      trigger: 'TELLER_BET_STEP_ALREADY_ANSWERED',
      playerId: player._id,
      templateVars: {
        step: raceBet.step,
        expected_step: step,
      },
    });
    return;
  }

  const teller = await Tellers.findOneAsync(raceBet.teller);
  const race = await Races.findOneAsync(raceBet.race, {
    fields: {
      horses: 1,
      odds: 1,
    },
    sort: {
      number: 1,
    },
  });
  const horses = await Horses.find(
    { _id: { $in: race?.horses } },
    {
      fields: {
        name: 1,
        short_name: 1,
        number: 1,
        color: 1,
      },
    },
  ).fetchAsync();

  if (!teller || !race) {
    throw new Error('Teller or race not found, this should not happen');
  }

  if (step === 'bet-type') {
    return raceBetProcessBetType({
      player,
      raceBet,
      race,
      value,
    });
  }

  if (step.startsWith('horse')) {
    return raceBetProcessHorse({
      player,
      raceBet,
      race,
      horseNum: parseInt(step.replace('horse', '')),
      value,
    });
  }

  // if (step === 'wager') {
  //   return processBetWagerText({
  //     player,
  //     raceBet,
  //     teller,
  //     race,
  //     horses,
  //     value,
  //   });
  // }

  // if (step === 'cancel') {
  //   return processBetCancelText({
  //     player,
  //     raceBet,
  //     teller,
  //     race,
  //     horses,
  //     value,
  //   });
  // }
};
