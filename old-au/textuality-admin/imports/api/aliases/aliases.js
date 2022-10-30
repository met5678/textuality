import { Mongo } from 'meteor/mongo';

import AliasSchema from 'schemas/alias';

const Aliases = new Mongo.Collection('aliases');

Aliases.attachSchema(AliasSchema);

export default Aliases;
