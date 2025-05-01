import RaceBets from './raceBets';
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
