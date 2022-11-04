import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

import ClueSchema from './clue';

const AchievementSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  name: String,
  number: SimpleSchema.Integer,
  trigger: {
    type: String,
    allowedValues: [
      'CHECKPOINT',
      'CHECKPOINT_GROUP',
      'EMOJIS_IN_TEXT',
      'GUESS_COMPLETE',
      'JOINED',
      'MISSION',
      'N_MISSION',
      'N_PICTURES_SENT',
      'N_TEXTS_SENT',
      'PICTURE_MULTI_FACES',
    ],
  },
  triggerDetail: {
    type: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    optional: true,
  },
  clueAwardType: {
    type: String,
    allowedValues: [...ClueSchema.get('type', 'allowedValues'), 'any', 'none'],
    defaultValue: 'none',
  },
  playerText: {
    type: String,
    max: 140,
    optional: true,
  },
  screenText: {
    type: String,
    max: 140,
    optional: true,
  },
  hideFromCasefile: {
    type: Boolean,
    defaultValue: false,
  },
  earned: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
});

export default AchievementSchema;
