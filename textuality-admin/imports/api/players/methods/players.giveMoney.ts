import Players from '../players';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { PlayerId } from '/imports/schemas/player';

type PlayerGiveMoneyArgs = {
  playerId: PlayerId;
  money: number;
};

export const playerGiveMoney = async ({
  playerId,
  money,
}: PlayerGiveMoneyArgs) => {
  await Players.updateAsync(playerId, { $inc: { money } });
};

export const playerGiveMoneyMethod = getWrappedServerMethod(
  'players.giveMoney',
  playerGiveMoney,
);
