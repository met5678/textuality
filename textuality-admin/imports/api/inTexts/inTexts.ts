import { Mongo } from 'meteor/mongo';

import { InText as InTextOrig, InTextSchema } from '/imports/schemas/inText';

interface InText extends InTextOrig {
  getAvatarUrl: (dimension: number) => string;
  hasEmoji: () => boolean;
  bigEmojiOnFeed: () => boolean;
}

const InTexts = new Mongo.Collection<InTextOrig, InText>('inTexts');

InTexts.attachSchema(InTextSchema);

export default InTexts;
