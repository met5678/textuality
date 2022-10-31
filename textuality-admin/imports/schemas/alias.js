import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const AliasSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  name: String,
  used: Boolean
});

export default AliasSchema;
