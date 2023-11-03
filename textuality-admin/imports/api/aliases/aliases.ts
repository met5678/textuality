import { Mongo } from 'meteor/mongo';

import { Alias, AliasSchema } from '/imports/schemas/alias';

const Aliases = new Mongo.Collection<Alias>('aliases');

Aliases.attachSchema(AliasSchema);

export default Aliases;
