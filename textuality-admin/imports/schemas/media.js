import SimpleSchema from 'simpl-schema';

import Events from 'api/events';
import Players from 'api/players';

const MediaSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  player: {
    type: String,
    allowedValues: () => {
      Players.find()
        .fetch()
        .map(player => player._id);
    }
  },
  faces: {
    type: Array,
    defaultValue: []
  },
  'faces.$': [SimpleSchema.Integer],
  width: SimpleSchema.Integer,
  height: SimpleSchema.Integer,
  type: {
    type: String,
    allowedValues: ['image', 'anim-gif', 'video']
  },
  time: Date,
  purpose: {
    type: String,
    allowedValues: ['none', 'avatar', 'feed']
  }
});

export default MediaSchema;
