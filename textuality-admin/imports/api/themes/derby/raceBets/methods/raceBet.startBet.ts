import Tellers from '../../tellers/tellers';
import RaceBets from '../raceBets';
import Events from '/imports/api/events';
import Players from '/imports/api/players/players';
import { RaceId } from '/imports/schemas/derby/race';
import { RaceBet } from '/imports/schemas/derby/raceBet';
import { TellerId } from '/imports/schemas/derby/teller';
import { PlayerId } from '/imports/schemas/player';
import { OptionalId } from '/imports/utils/optional-id';

export const raceBetStartBet = async ({
  player_id,
  teller_id,
  race_id,
}: {
  player_id: PlayerId;
  teller_id: TellerId;
  race_id: RaceId;
}) => {
  const player = await Players.findOneAsync(player_id, {
    fields: { money: 1 },
  });

  if (!player) return;

  const teller = await Tellers.findOneAsync(teller_id, {
    fields: { text_code: 1 },
  });

  if (!teller) return;

  const raceBet: OptionalId<RaceBet> = {
    event: Events.currentIdOrThrow(),
    player: player_id,
    teller: teller_id,
    teller_text_code: teller.text_code,
    race: race_id,
    status: 'pending',
    step: 'bet-type',
    started_at: new Date(),
  };

  const id = await RaceBets.insertAsync(raceBet);
  return id;
};
