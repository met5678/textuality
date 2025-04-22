import { SimpleSchema } from 'simpl-schema/dist/esm/SimpleSchema';
import { TellerId } from './teller';
import Events from '/imports/api/events';
import { EventId } from '../event';

type FortuneTellerId = string;

const FORTUNE_TELLER_CLUE_TYPES = ['horse', 'stat'] as const;
type FortuneTellerClueType = (typeof FORTUNE_TELLER_CLUE_TYPES)[number];

const FORTUNE_TELLER_STATUSES = [
  'opening',
  'idle',
  'closing',
  'inactive',
] as const;
type FortuneTellerStatus = (typeof FORTUNE_TELLER_STATUSES)[number];

type FortuneTeller = {
  _id: FortuneTellerId;
  event: EventId;
  takeover_teller: TellerId;
  takeover_at: Date;
  takeover_seconds: number;
  text_code: string;
  clue_types: FortuneTellerClueType[];
  status: FortuneTellerStatus;
  time_left?: number;
};

const FortuneTellerSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  takeover_teller: {
    type: String,
  },
  takeover_at: {
    type: Date,
  },
  takeover_seconds: {
    type: SimpleSchema.Integer,
    min: 10,
    defaultValue: 60,
  },
  text_code: {
    type: String,
    defaultValue: 'magic',
  },
  clue_types: {
    type: Array,
    defaultValue: ['horse', 'stat'],
  },
  'clue_types.$': {
    type: String,
    allowedValues: [...FORTUNE_TELLER_CLUE_TYPES],
  },
  status: {
    type: String,
    allowedValues: [...FORTUNE_TELLER_STATUSES],
    defaultValue: 'inactive',
  },
  time_left: {
    type: SimpleSchema.Integer,
    optional: true,
  },
});

export {
  FortuneTellerSchema,
  FORTUNE_TELLER_CLUE_TYPES,
  FORTUNE_TELLER_STATUSES,
};
export type { FortuneTeller, FortuneTellerClueType, FortuneTellerStatus };
