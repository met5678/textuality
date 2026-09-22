import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';

const sendOverUnderClue = (result: number, player_id: string) => {
  let pivotNumber: number;

  do {
    pivotNumber = Math.floor(Math.random() * 23) + 7;
  } while (pivotNumber === result);

  const clueText = `The spin's gonna land on a number ${
    pivotNumber > result ? 'LESS THAN' : 'GREATER THAN'
  } ${pivotNumber}!`;

  sendAutoText({
    trigger: 'HACKER_ROULETTE_SIMPLE',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendOverUnderClue;
