import { Meteor } from 'meteor/meteor';
import Players from '../players';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { PlayerId } from '/imports/schemas/player';
import { sendAutoText } from '../../autoTexts/methods/autoTexts.send';

type PlayerTakeMoneyArgs = {
  playerId: PlayerId;
  money: number;
};

export const playerTakeMoney = async ({
  playerId,
  money,
}: PlayerTakeMoneyArgs) => {
  const player = await Players.findOneAsync(playerId);
  if (!player) return;
  if (money > player.money) {
    await Players.updateAsync(playerId, { $set: { money: 0 } });
    player.money = 0;
  } else {
    await Players.updateAsync(playerId, { $inc: { money: -money } });
    player.money -= money;
  }

  if (player.money === 0) {
    if (
      !Meteor.call('achievements.tryUnlock', {
        trigger: 'BANKRUPT',
        playerId: player._id,
      })
    ) {
      sendAutoText({
        trigger: 'WALLET_BANKRUPT',
        playerId: player._id,
      });
    }
  }
};

export const playerTakeMoneyMethod = getWrappedServerMethod(
  'players.takeMoney',
  playerTakeMoney,
);
