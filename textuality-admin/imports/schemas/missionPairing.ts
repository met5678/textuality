import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';
import { MissionId } from './mission';
import { MediaId } from './media';

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

export type MissionPairingId = string;

interface MissionPairing {
  _id: MissionPairingId;
  event: EventId;
  mission: MissionId;
  playerA: PlayerId;
  playerB: PlayerId;
  aliasA: string;
  aliasB: string;
  avatarA: MediaId;
  avatarB: MediaId;
  hashtag: string;
  complete?: boolean;
  timeComplete?: Date;
}

export default MissionPairingSchema;
export { MissionPairing, MissionPairingSchema };
