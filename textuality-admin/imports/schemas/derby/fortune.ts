import { SimpleSchema } from 'simpl-schema/dist/esm/SimpleSchema';
import { TellerId } from './teller';
import Events from '/imports/api/events';
import { EventId } from '../event';
import { PlayerId } from '../player';
import { HorseId, HorseStat } from './horse';

export type FortuneId = string;

export const FORTUNE_TYPES = ['horse', 'stat-top', 'stat-bottom'] as const;
export type FortuneType = (typeof FORTUNE_TYPES)[number];

export const FORTUNE_STATUSES = [
  'pending',
  'given',
  'cancelled-timeout',
] as const;
export type FortuneStatus = (typeof FORTUNE_STATUSES)[number];

export type Fortune = {
  _id: FortuneId;
  teller: TellerId;
  teller_text_code: string;
  event: EventId;
  player: PlayerId;
  status: FortuneStatus;
  started_at: Date;

  type?: FortuneType;
  horse?: HorseId;
  stat?: HorseStat;
  given_at?: Date;
};

export type FortuneComplete = Required<Fortune>;

export const FortuneSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  teller: {
    type: String,
  },
  teller_text_code: {
    type: String,
  },
  player: {
    type: String,
  },
  status: {
    type: String,
    allowedValues: [...FORTUNE_STATUSES],
  },
  started_at: {
    type: Date,
  },
  type: {
    type: String,
    allowedValues: [...FORTUNE_TYPES],
    optional: true,
  },
  horse: {
    type: String,
    optional: true,
  },
  stat: {
    type: String,
    optional: true,
  },
  given_at: {
    type: Date,
    optional: true,
  },
});
