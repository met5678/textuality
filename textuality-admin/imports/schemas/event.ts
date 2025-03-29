import SimpleSchema from 'simpl-schema';

// Define allowed values as const arrays
const THEME_VALUES = ['clue', 'casino', 'derby'] as const;
const SKIN_VALUES = ['normal', 'space'] as const;
const STATE_VALUES = ['normal', 'finale'] as const;

// Generate types from the const arrays
type EventTheme = (typeof THEME_VALUES)[number];
type EventSkin = (typeof SKIN_VALUES)[number];
type EventState = (typeof STATE_VALUES)[number];

// Define the schema
const EventSchema = new SimpleSchema({
  name: String,
  phoneNumber: String,
  active: Boolean,
  theme: {
    type: String,
    allowedValues: [...THEME_VALUES],
    defaultValue: 'casino',
  },
  skin: {
    type: String,
    allowedValues: [...SKIN_VALUES],
    defaultValue: 'normal',
  },
  state: {
    type: String,
    allowedValues: [...STATE_VALUES],
    defaultValue: 'normal',
  },
  finale_data: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

export type EventId = string;

// Define TypeScript interface matching the schema
interface Event {
  _id: EventId;
  name: string;
  phoneNumber: string;
  active: boolean;
  theme: EventTheme;
  skin: EventSkin;
  state: EventState;
  finale_data: Record<string, unknown>;
}

export default EventSchema;
export { Event, EventSchema, EventState, EventTheme, EventSkin };
