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
    allowedValues: () => Events.allIds(),
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
      'countdown',
      'reveal-intro',
      'reveal-room',
      'reveal-person',
      'reveal-weapon',
      'reveal-finale',
      'complete',
      'aborted',
    ],
    optional: true,
  },
  timeStart: {
    type: Date,
    optional: true,
  },
  timeEnd: {
    type: Date,
    optional: true,
  },
  solution: RoundSolution,
});

export default Round;
