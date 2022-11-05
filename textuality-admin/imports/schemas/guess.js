import SimpleSchema from 'simpl-schema';

import Events from 'api/events';
import Rounds from 'api/rounds';
import Clues from 'api/clues';

const Guess = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () => Events.allIds(),
  },
  round: {
    type: String,
    allowedValues: () => Rounds.allIds(),
  },
  player: String,
  alias: String,
  avatar: String,

  person: {
    type: String,
    optional: true,
    allowedValues: () =>
      Clues.find({ type: 'person' }, { fields: { shortName: 1 } })
        .fetch()
        .map((clue) => clue.shortName),
  },
  room: {
    type: String,
    optional: true,
    allowedValues: () =>
      Clues.find({ type: 'room' }, { fields: { shortName: 1 } })
        .fetch()
        .map((clue) => clue.shortName),
  },
  weapon: {
    type: String,
    optional: true,
    allowedValues: () =>
      Clues.find({ type: 'weapon' }, { fields: { shortName: 1 } })
        .fetch()
        .map((clue) => clue.shortName),
  },

  numParts: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },

  timeComplete: {
    type: Date,
    optional: true,
  },

  timePerson: {
    type: Date,
    optional: true,
  },

  timeRoom: {
    type: Date,
    optional: true,
  },

  timeWeapon: {
    type: Date,
    optional: true,
  },
});

export default Guess;
