import SimpleSchema from 'simpl-schema';

import Events from 'api/events';
import Clues from 'api/clues';

const RoundSolution = new SimpleSchema({
  person: {
    type: String,
    allowedValues: () =>
      Clues.find({ type: 'person' }, { fields: { shortName: 1 } })
        .fetch()
        .map((clue) => clue.shortName),
  },
  room: {
    type: String,
    allowedValues: () =>
      Clues.find({ type: 'room' }, { fields: { shortName: 1 } })
        .fetch()
        .map((clue) => clue.shortName),
  },
  weapon: {
    type: String,
    allowedValues: () =>
      Clues.find({ type: 'weapon' }, { fields: { shortName: 1 } })
        .fetch()
        .map((clue) => clue.shortName),
  },
});

const Round = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () =>
      Events.find()
        .fetch()
        .map((event) => event._id),
  },
  number: SimpleSchema.Integer,
  name: String,
  active: {
    type: Boolean,
    defaultValue: false,
  },
  status: {
    type: String,
    allowedValues: [
      'active',
      'ending',
      'reveal-room',
      'reveal-person',
      'reveal-weapon',
      'reveal-finale',
      'complete',
    ],
    optional: true,
  },
  solution: RoundSolution,
});

export default Round;
