import { Mongo } from 'meteor/mongo';

import PlayerSchema from 'schemas/player';

const Players = new Mongo.Collection('players');

Players.attachSchema(PlayerSchema);

export default Players;
