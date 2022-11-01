import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const clueRewardSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  clue_id: String,
  clue_name: String,
  time: Date,
  player: String,
  alias: String,
  avatar: String,
  numClues: SimpleSchema.Integer,
  hideFromScreen: {
    type: Boolean,
    defaultValue: false,
  },
});

export default clueRewardSchema;
