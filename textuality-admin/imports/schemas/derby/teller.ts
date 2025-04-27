import SimpleSchema from 'simpl-schema';
import Events from '/imports/api/events';
import { EventId } from '../event';
import { PlayerId } from '../player';
import { RACE_BET_TYPES } from './raceBet';
import { RaceBetId } from './raceBet';

const TELLER_ACTORS = ['jon', 'breiner'] as const;
type TellerActor = (typeof TELLER_ACTORS)[number];

const TELLER_STATUS = [
  'opening',
  'open',
  'betting',
  'betting-impatient',
  'timeout',
  'giving-stub-single',
  'giving-stub-multi',
  'closing',
  'break',
  'standup',
  'empty',
  'sitdown',
] as const;
type TellerStatus = (typeof TELLER_STATUS)[number];

const TELLER_BET_TYPES = [
  'win',
  'exacta',
  'trifecta',
  'exacta-box',
  'trifecta-box',
] as const;
type TellerBetType = (typeof TELLER_BET_TYPES)[number];

type TellerId = string;

type Teller = {
  _id: TellerId;
  url: string;
  event: EventId;
  actor: TellerActor;
  min_wager: number;

  text_code: string;
  available_bet_types: TellerBetType[];
  status: TellerStatus;
  time_left?: number;
  current_player?: PlayerId;
  current_bet?: RaceBetId;
};

const TellerSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  url: {
    type: String,
  },
  actor: {
    type: String,
    allowedValues: [...TELLER_ACTORS],
    defaultValue: 'jon',
  },
  min_wager: {
    type: SimpleSchema.Integer,
    min: 0,
    defaultValue: 0,
  },
  text_code: {
    type: String,
    defaultValue: '',
    optional: true,
  },
  available_bet_types: {
    type: Array,
    defaultValue: ['win', 'exacta', 'trifecta'],
    minCount: 1,
    maxCount: 3,
  },
  'available_bet_types.$': {
    type: String,
    allowedValues: [...RACE_BET_TYPES],
  },
  status: {
    type: String,
    allowedValues: [...TELLER_STATUS],
    defaultValue: 'closed',
  },
  time_left: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  current_player: {
    type: String,
    optional: true,
  },
  current_bet: {
    type: String,
    optional: true,
  },
});

export { TellerSchema, TELLER_ACTORS, TELLER_STATUS, TELLER_BET_TYPES };
export type { TellerId, TellerActor, TellerStatus, Teller };
