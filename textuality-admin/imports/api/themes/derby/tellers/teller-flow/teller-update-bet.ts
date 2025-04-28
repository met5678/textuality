import RaceBets from '../../raceBets';
import Tellers from '../tellers';
import { tellerStartRaceBet } from './teller-start-bet';
import { RaceBetId } from '/imports/schemas/derby/raceBet';
import { TellerId } from '/imports/schemas/derby/teller';

export const tellerUpdateBet = async (
  teller_id: TellerId,
  bet_id: RaceBetId,
) => {
  const teller = await Tellers.findOneAsync(teller_id);
  const bet = await RaceBets.findOneAsync(bet_id);
  if (!teller) {
    console.warn(
      `Can't update bet for teller ${teller_id} because it doesn't exist`,
    );
    return;
  }
  // if (!bet) {
  //   console.warn(
  //     `Can't update bet for teller ${teller_id} because the bet doesn't exist`,
  //   );
  //   return;
  // }

  tellerStartRaceBet(teller_id, bet_id, bet?.player ?? '');
};
