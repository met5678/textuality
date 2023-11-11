import { Meteor } from 'meteor/meteor';

const sendOverUnderClue = (result: number, player_id: string) => {
  let pivotNumber: number;

  do {
    pivotNumber = Math.floor(Math.random() * 25) + 6;
  } while (pivotNumber === result);

  const clueText = `The spin's gonna land on a number ${
    pivotNumber > result ? 'LESS THAN' : 'GREATER THAN'
  } ${pivotNumber}!`;

  Meteor.call('autoTexts.send', {
    trigger: 'HACKER_ROULETTE_SIMPLE',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendOverUnderClue;
