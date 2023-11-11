import SimpleSchema from 'simpl-schema';

const EventSchema = new SimpleSchema({
  name: String,
  phoneNumber: String,
  active: Boolean,
  theme: {
    type: String,
    allowedValues: ['clue', 'casino'],
    defaultValue: 'casino',
  },
  state: {
    type: String,
    defaultValue: 'normal',
    allowedValues: ['normal', 'finale'],
  },
});

type EventState = 'normal' | 'finale';

interface Event {
  _id: string;
  name: string;
  phoneNumber: string;
  active: boolean;
  theme: string;
  state: EventState;
}

export default EventSchema;
export { Event, EventSchema, EventState };
