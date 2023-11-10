import { Mongo } from 'meteor/mongo';

import {
  MissionPairing,
  MissionPairingSchema,
} from '/imports/schemas/missionPairing';

interface MissionPairingWithHelpers extends MissionPairing {
  getAvatarUrlA(): string;
  getAvatarUrlB(): string;
}

const MissionPairings = new Mongo.Collection<
  MissionPairing,
  MissionPairingWithHelpers
>('missionPairings');

MissionPairings.attachSchema(MissionPairingSchema);

export default MissionPairings;
