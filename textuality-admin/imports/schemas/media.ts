import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const MediaSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  player: String,
  faces: {
    type: Array,
    defaultValue: [],
  },
  'faces.$': [SimpleSchema.Integer],
  width: SimpleSchema.Integer,
  height: SimpleSchema.Integer,
  type: {
    type: String,
    allowedValues: ['image', 'anim-gif'],
  },
  time: Date,
  purpose: {
    type: String,
    allowedValues: ['none', 'avatar-fail', 'avatar', 'feed'],
  },
});

interface Media {
  _id: string;
  event: string;
  player: string;
  faces: number[];
  width: number;
  height: number;
  type: string;
  time: Date;
  purpose: string;
}

export default MediaSchema;
export { Media, MediaSchema };
