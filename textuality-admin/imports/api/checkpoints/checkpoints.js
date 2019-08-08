import { Mongo } from 'meteor/mongo';

import CheckpointSchema from 'schemas/checkpoint';

const Checkpoints = new Mongo.Collection('checkpoints');

Checkpoints.attachSchema(CheckpointSchema);

export default Checkpoints;
