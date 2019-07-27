import SimpleSchema from 'simpl-schema';

const EventSchema = new SimpleSchema({
  name: String,
  phone_number: String,
  active: Boolean
});

// Maybe add 'theme'

export default EventSchema;
