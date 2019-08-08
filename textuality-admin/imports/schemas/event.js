import SimpleSchema from 'simpl-schema';

const EventSchema = new SimpleSchema({
  name: String,
  phoneNumber: String,
  active: Boolean
});

// Maybe add 'theme'

export default EventSchema;
