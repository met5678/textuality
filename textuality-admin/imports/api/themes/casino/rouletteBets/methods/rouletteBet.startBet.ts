import RouletteBets from '../rouletteBets';
import Events from '/imports/api/events';
import Players from '/imports/api/players/players';
import { PlayerId } from '/imports/schemas/player';
import { RouletteId } from '/imports/schemas/roulette';
import { RouletteBet } from '/imports/schemas/rouletteBet';
import { OptionalId } from '/imports/utils/optional-id';

export const rouletteBetStartBet = async ({
  player_id,
  roulette_id,
}: {
  player_id: PlayerId;
  roulette_id: RouletteId;
}) => {
  const player = await Players.findOneAsync(player_id, {
    fields: { money: 1, alias: 1, avatar: 1 },
  });

  if (!player) return;

  const rouletteBet: OptionalId<RouletteBet> = {
    event: Events.currentIdOrThrow(),
    player: {
      id: player_id,
      money: player.money,
      alias: player.alias,
      avatar_id: player.avatar!,
    },
    roulette_id: roulette_id,
    status: 'pending',
    step: 'type',
    time: new Date(),
    win_payout: 0,
  };

  const id = await RouletteBets.insertAsync(rouletteBet);
  return id;
};
