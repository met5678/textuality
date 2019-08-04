import { Mongo } from 'meteor/mongo';

import MediaSchema from 'schemas/media';

const Media = new Mongo.Collection('media');

Media.attachSchema(MediaSchema);

export default Media;
