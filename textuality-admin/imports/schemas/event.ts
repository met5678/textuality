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
  finale_data: {
    type: Object,
    optional: true,
    blackbox: true,
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
  finale_data: any;
}

export default EventSchema;
export { Event, EventSchema, EventState };
