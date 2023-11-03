import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const AliasSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () => Events.allIds(),
  },
  name: String,
  used: Boolean,
});

interface Alias {
  _id?: string;
  event: string;
  name: string;
  used: boolean;
}

export default AliasSchema;
export { Alias, AliasSchema };
