import { Meteor } from 'meteor/meteor';

const FIBONACCI = [0, 1, 2, 3, 5, 8, 13, 21, 34];
const PRIME_NUMBERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
const TRIANGLE_NUMBERS = [0, 1, 3, 6, 10, 15, 21, 28, 36];

const sequences = [
  {
    name: 'number in the Fibonacci sequence',
    sequence: FIBONACCI,
  },
  {
    name: 'triangular number',
    sequence: TRIANGLE_NUMBERS,
  },
  {
    name: 'prime number',
    sequence: PRIME_NUMBERS,
  },
];

const sendSequenceClue = (result: number, player_id: string) => {
  const sequence = sequences[Math.floor(Math.random() * sequences.length)];

  const inSequence = sequence.sequence.includes(result);

  const clueText = `The spin's result is ${
    !inSequence ? 'NOT' : ''
  } gonna be a *${sequence.name}*!`;

  Meteor.call('autoTexts.send', {
    trigger: 'HACKER_ROULETTE_MATH',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendSequenceClue;
