import SimpleSchema from 'simpl-schema';

import Events from 'api/events';

const Clue = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  name: String,
  shortName: String,
  type: {
    type: String,
    allowedValues: ['person', 'room', 'weapon'],
  },
  playerText: {
    type: String,
    max: 160,
  },
  earned: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },
});

export default Clue;
