import { Mongo } from 'meteor/mongo';

import { Checkpoint, CheckpointSchema } from '/imports/schemas/checkpoint';

const Checkpoints = new Mongo.Collection<Checkpoint>('checkpoints');

Checkpoints.attachSchema(CheckpointSchema);

export default Checkpoints;
