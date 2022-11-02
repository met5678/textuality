import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AliasSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () => Events.allIds(),
  },
  name: String,
  used: Boolean,
});

export default AliasSchema;
