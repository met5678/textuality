import { Meteor } from 'meteor/meteor';
import Tellers from '../../tellers/tellers';
import Fortunes from '../fortunes';
import Events from '/imports/api/events';
import { Fortune } from '/imports/schemas/derby/fortune';
import { TellerId } from '/imports/schemas/derby/teller';
import { PlayerId } from '/imports/schemas/player';
import { OptionalId } from '/imports/utils/optional-id';
import { fortuneAskType } from './fortune.askType';

export const fortuneStartFortune = async ({
  player_id,
  teller_id,
}: {
  player_id: PlayerId;
  teller_id: TellerId;
}) => {
  const teller = await Tellers.findOneAsync(teller_id);
  if (!teller) return;

  Meteor.call('players.takeMoney', {
    playerId: player_id,
    money: teller.min_wager,
  });

  const fortune: OptionalId<Fortune> = {
    event: Events.currentIdOrThrow(),
    player: player_id,
    teller: teller_id,
    teller_text_code: teller.text_code,
    started_at: new Date(),
    status: 'pending',
  };

  const id = await Fortunes.insertAsync(fortune);
  return Fortunes.findOneAsync(id);
};
