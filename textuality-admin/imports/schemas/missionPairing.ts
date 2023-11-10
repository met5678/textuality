import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const MissionPairingSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  mission: String,
  playerA: String,
  playerB: String,
  aliasA: String,
  aliasB: String,
  avatarA: String,
  avatarB: String,
  hashtag: String,
  complete: {
    type: Boolean,
    defaultValue: false,
  },
  timeComplete: {
    type: Date,
    optional: true,
  },
});

interface MissionPairing {
  _id?: string;
  event: string;
  mission: string;
  playerA: string;
  playerB: string;
  aliasA: string;
  aliasB: string;
  avatarA: string;
  avatarB: string;
  hashtag: string;
  complete?: boolean;
  timeComplete?: Date;
}

export default MissionPairingSchema;
export { MissionPairing, MissionPairingSchema };
