import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const MissionPairingSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map(event => event._id)
  },
  mission: String,
  playerA: String,
  playerB: String,
  aliasA: String,
  aliasB: String,
  avatarA: String,
  avatarB: String,
  hashtag: String,
  complete: {
    type: Boolean,
    defaultValue: false
  },
  timeComplete: {
    type: Date,
    optional: true
  }
});

export default MissionPairingSchema;
