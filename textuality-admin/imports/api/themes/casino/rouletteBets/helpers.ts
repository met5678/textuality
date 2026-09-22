import { getPendingRouletteBet } from './methods/rouletteBet.getPendingBet';
import RouletteBets from './rouletteBets';
import { Player } from '/imports/schemas/player';
import { RouletteBetStep } from '/imports/schemas/rouletteBet';
import { IncomingMessageData } from '/imports/services/whatsapp';

RouletteBets.helpers({
  isNumberBet(): boolean {
    try {
      const num = parseInt(String(this.bet_slot));
      return num >= 0 && num <= 36;
    } catch (e) {
      return false;
    }
  },

  isColorBet() {
    return this.bet_slot === 'red' || this.bet_slot === 'black';
  },

  isOddEvenBet() {
    return this.bet_slot === 'even' || this.bet_slot === 'odd';
  },

  isSpecialBet() {
    return this.isColorBet() || this.isOddEvenBet();
  },
});

export const BET_STEPS_ACCEPTING_FREE_INPUT: Array<RouletteBetStep> = [
  'number',
  'wager',
];

export const betStepIsAcceptingFreeInput = async ({
  message,
  player,
}: {
  message: IncomingMessageData;
  player: Player;
}) => {
  console.log(`Checking if bet step is accepting free input`, {
    message,
  });
  const pendingRouletteBet = await getPendingRouletteBet({ player });
  console.log(`Pending roulette bet`, { pendingRouletteBet });
  if (!pendingRouletteBet) {
    return false;
  }

  if (
    BET_STEPS_ACCEPTING_FREE_INPUT.includes(pendingRouletteBet.step) &&
    message.text.length > 0
  ) {
    return true;
  }

  return false;
};
