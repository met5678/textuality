import { Mongo } from 'meteor/mongo';

import { Player as PlayerOrig, PlayerSchema } from '/imports/schemas/player';

interface Player extends PlayerOrig {
  getAvatarUrl: (dimension: number) => string;
}

const Players = new Mongo.Collection<PlayerOrig, Player>('players');

Players.attachSchema(PlayerSchema);

export default Players;
