import SimpleSchema from 'simpl-schema';
import { PlayerId } from '../player';
import { HORSE_STATS, HorseId, HorseStat } from './horse';
import { EventId } from '../event';
import Events from '/imports/api/events';
export type PowerupId = string;

export type Powerup = {
  _id: PowerupId;
  event: EventId;
  horse: HorseId;
  player: PlayerId;
  stat: HorseStat;
  value: number;
  level_at_award_time: number;
  given_at: Date;
};

export const PowerupSchema = new SimpleSchema({
  _id: { type: String },
  event: { type: String, allowedValues: Events.allIds },
  horse: { type: String },
  player: { type: String },
  stat: {
    type: String,
    allowedValues: [...HORSE_STATS],
  },
  value: { type: Number },
  level_at_award_time: { type: Number },
  given_at: { type: Date },
});
