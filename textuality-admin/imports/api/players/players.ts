import { Mongo } from 'meteor/mongo';

import { Player, PlayerSchema } from '/imports/schemas/player';

interface PlayerWithHelpers extends Player {
  getAvatarUrl: (dimension?: number, zoom?: number) => string;
}

const Players = new Mongo.Collection<Player, PlayerWithHelpers>('players');

Players.attachSchema(PlayerSchema);

export default Players;
export { PlayerWithHelpers };
