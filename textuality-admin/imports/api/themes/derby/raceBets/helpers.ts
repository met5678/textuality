import RaceBets, { RaceBetWithHelpers } from './raceBets';
import { RaceBet, RaceBetComplete } from '/imports/schemas/derby/raceBet';

function isRaceBetComplete(bet: RaceBet): bet is RaceBetComplete {
  return (
    bet.type !== undefined &&
    bet.horses !== undefined &&
    bet.base_bet !== undefined &&
    bet.count !== undefined &&
    bet.placed_at !== undefined
  );
}
// Helper functions will be added here as needed
RaceBets.helpers({
  totalWager() {
    const raceBet = this;
    return (raceBet.base_bet ?? 0) * (raceBet.count ?? 0);
  },
});

export const condenseRaceBets = (raceBets: RaceBetWithHelpers[]) => {
  return raceBets.reduce((acc, bet) => {
    const existingBet = acc.find(
      (b) => b.player === bet.player && b.type === bet.type,
    );
    if (existingBet) {
      existingBet.payout = (existingBet.payout ?? 0) + (bet.payout ?? 0);
    } else {
      acc.push(bet);
    }
    return acc;
  }, [] as RaceBetWithHelpers[]);
};
