import { fortuneCancelFortune } from '../../fortunes/methods/fortune.cancelFortune';
import {
  throwIfCancelledTimeout,
  TimeoutError,
} from '../teller-flow/_teller-timeouts';
import Tellers from '../tellers';
import { fortuneTellerClose } from './teller.fortune.closeTeller';
import { FortuneId } from '/imports/schemas/derby/fortune';
import { TellerId } from '/imports/schemas/derby/teller';
import { PlayerId } from '/imports/schemas/player';

const FORTUNE_TELLER_ENGAGED_TIMEOUT_SECONDS = 20;

export const fortuneTellerEngageTeller = async (
  tellerId: TellerId,
  fortuneId: FortuneId,
  playerId: PlayerId,
) => {
  const teller = await Tellers.findOneAsync({ _id: tellerId });
  if (!teller) {
    throw new Error('Teller not found');
  }

  let time_left = FORTUNE_TELLER_ENGAGED_TIMEOUT_SECONDS;
  Tellers.updateAsync(
    { _id: tellerId },
    {
      $set: {
        status: 'fortune-engaged',
        current_player: playerId,
        time_left,
      },
      $unset: { text_code: 1 },
    },
  );
  teller.status = 'fortune-engaged';
  teller.current_player = playerId;
  teller.time_left = time_left;

  do {
    console.log('time_left', time_left);
    Tellers.updateAsync(tellerId, {
      $set: {
        time_left,
      },
    });
    teller.time_left = time_left;

    try {
      await throwIfCancelledTimeout(tellerId, 1);
    } catch (error) {
      if (error === TimeoutError) return;
      throw error;
    }

    time_left -= 1;
  } while (time_left > 0);

  fortuneCancelFortune(fortuneId, playerId);
  fortuneTellerClose(tellerId);
};
