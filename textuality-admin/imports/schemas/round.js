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

const RevealState = new SimpleSchema({
  phase: {
    type: String,
    defaultValue: 'intro',
    allowedValues: [
      'intro',
      'intro-evidence',
      'intro-clues',
      'intro-guesses',

      'room-intro',
      'room-present',
      'room-no',
      'room-yes',

      'person-intro',
      'person-present',
      'person-no',
      'person-yes',

      'weapon-intro',
      'weapon-present',
      'weapon-no',
      'weapon-yes',

      'finale-solution',
      'finale-winners',
    ],
  },

  currentClue: {
    type: String,
    optional: true,
  },

  currentPlayers: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'currentPlayers.$': Object,
  'currentPlayers.$.id': String,
  'currentPlayers.$.alias': String,
  'currentPlayers.$.avatar': String,

  guessesSubmitted: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },

  cluesCollected: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },

  evidenceFound: {
    type: SimpleSchema.Integer,
    defaultValue: 0,
  },

  goddessBlackout: {
    type: Boolean,
    defaultValue: false,
  },

  goddessTags: {
    type: Array,
    defaultValue: [],
  },

  'goddessTags.$': String,
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
    allowedValues: ['active', 'countdown', 'reveal', 'complete', 'aborted'],
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
  revealState: {
    type: RevealState,
    optional: true,
  },
  solution: RoundSolution,
});

export default Round;
