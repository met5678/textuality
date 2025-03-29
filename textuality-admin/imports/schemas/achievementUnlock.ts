import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { AchievementId } from './achievement';
import { PlayerId } from './player';

const AchievementUnlockSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  achievement: String,
  name: String,
  time: Date,
  player: String,
  alias: String,
  avatar: String,
  numAchievements: SimpleSchema.Integer,
  hideFromScreen: {
    type: Boolean,
    defaultValue: false,
  },
});

export type AchievementUnlockId = string;

interface AchievementUnlock {
  _id: AchievementUnlockId;
  event: EventId;
  achievement: AchievementId;
  name: string;
  time: Date;
  player: PlayerId;
  alias: string;
  avatar: string;
  numAchievements: number;
  hideFromScreen?: boolean;
}

export default AchievementUnlockSchema;
export { AchievementUnlock, AchievementUnlockSchema };
