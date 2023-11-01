import { Mongo } from 'meteor/mongo';

import { Media as MediaOrig, MediaSchema } from '/imports/schemas/media';

interface Media extends MediaOrig {
  getAvatarUrl: (dimension: number) => string;
  getUrl: (width: number, height: number) => string;
  getFeedUrl: () => string;
  ratio: () => number;
  isSquare: () => boolean;
  isPortrait: () => boolean;
  isLandscape: () => boolean;
}

const Media = new Mongo.Collection<MediaOrig, Media>('media');

Media.attachSchema(MediaSchema);

export default Media;
