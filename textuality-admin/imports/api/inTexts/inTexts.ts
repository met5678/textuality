import { Mongo } from 'meteor/mongo';

import { InText, InTextSchema } from '/imports/schemas/inText';

interface InTextWithHelpers extends InText {
  getAvatarUrl: (dimension: number) => string;
  hasEmoji: () => boolean;
  bigEmojiOnFeed: () => boolean;
}

const InTexts = new Mongo.Collection<InText, InTextWithHelpers>('inTexts');

InTexts.attachSchema(InTextSchema);

export default InTexts;
export { InTextWithHelpers };
