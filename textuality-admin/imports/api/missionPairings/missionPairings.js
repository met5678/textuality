import { Mongo } from 'meteor/mongo';

import MissionPairingSchema from 'schemas/missionPairing';

const MissionPairings = new Mongo.Collection('missionPairings');

MissionPairings.attachSchema(MissionPairingSchema);

export default MissionPairings;
