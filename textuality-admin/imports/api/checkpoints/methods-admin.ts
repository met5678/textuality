import { Meteor } from 'meteor/meteor';

import Checkpoints from './checkpoints';
import { Checkpoint, CheckpointId } from '/imports/schemas/checkpoint';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';
import { EventId } from '/imports/schemas/event';

Meteor.methods({
  'checkpoints.new': async (checkpoint: OptionalId<Checkpoint>) => {
    if (
      await Checkpoints.findOneAsync({
        event: checkpoint.event,
        hashtag: checkpoint.hashtag,
      })
    ) {
      throw new Meteor.Error(
        'hashtag-in-use',
        'Hashtag in use by another checkpoint',
      );
    }
    const id = await Checkpoints.insertAsync(checkpoint);
    return await Checkpoints.findOneAsync(id);
  },

  'checkpoints.update': async (checkpoint: UpdateRequiredId<Checkpoint>) => {
    if (
      await Checkpoints.findOneAsync({
        _id: { $ne: checkpoint._id },
        event: checkpoint.event,
        hashtag: checkpoint.hashtag,
      })
    ) {
      throw new Meteor.Error(
        'hashtag-in-use',
        'Hashtag in use by another checkpoint',
      );
    }
    const id = checkpoint._id;
    await Checkpoints.updateAsync(id, { $set: checkpoint });
    return await Checkpoints.findOneAsync(id);
  },

  'checkpoints.upsert': async (checkpoint: OptionalId<Checkpoint>) => {
    if (!checkpoint._id) {
      return await Meteor.callAsync('checkpoints.new', checkpoint);
    } else {
      return await Meteor.callAsync('checkpoints.update', checkpoint);
    }
  },

  'checkpoints.duplicate': async (checkpointId: CheckpointId) => {
    const checkpoint = await Checkpoints.findOneAsync(checkpointId);
    if (!checkpoint) {
      throw new Meteor.Error('checkpoint-not-found', 'Checkpoint not found');
    }
    checkpoint.hashtag = `${checkpoint.hashtag}-copy`;
    return await Meteor.callAsync('checkpoints.new', checkpoint);
  },

  'checkpoints.delete': async (checkpointId: CheckpointId | CheckpointId[]) => {
    if (Array.isArray(checkpointId)) {
      return await Checkpoints.removeAsync({ _id: { $in: checkpointId } });
    } else {
      return await Checkpoints.removeAsync(checkpointId);
    }
  },

  'checkpoints.resetEvent': async (eventId: EventId) => {
    await Checkpoints.updateAsync(
      { event: eventId },
      { $set: { num_checkins: 0 } },
      { multi: true },
    );
  },
});
