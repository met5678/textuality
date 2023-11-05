import { Mongo } from 'meteor/mongo';

import { Media, MediaSchema } from '/imports/schemas/media';

interface MediaWithHelpers extends Media {
  getAvatarUrl: (dimension: number) => string;
  getUrl: (width: number, height: number) => string;
  getFeedUrl: () => string;
  ratio: () => number;
  isSquare: () => boolean;
  isPortrait: () => boolean;
  isLandscape: () => boolean;
}

const Medias = new Mongo.Collection<Media, MediaWithHelpers>('media');

Medias.attachSchema(MediaSchema);

export default Medias;
export { MediaWithHelpers };
