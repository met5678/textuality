import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';
import { EventId } from './event';
import { PlayerId } from './player';

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
  content_type: String,
  mime_type: String,
  external_id: String,
  time: Date,
  purpose: {
    type: String,
    allowedValues: ['none', 'avatar-fail', 'avatar', 'feed'],
  },
});

export type MediaPurpose = 'none' | 'avatar-fail' | 'avatar' | 'feed';
type FaceCoords = [number, number, number, number];

export type MediaId = string;

interface Media {
  _id: MediaId;
  event: EventId;
  player: PlayerId;
  faces: FaceCoords[];
  width: number;
  height: number;
  content_type: string;
  mime_type: string;
  external_id: string;
  time: Date;
  purpose: MediaPurpose;
}

export default MediaSchema;
export { Media, MediaSchema };
