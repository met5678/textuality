import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';

const sendOddEvenClue = (result: number, player_id: string) => {
  const clueText = `The spin's gonna land on an ${
    result % 2 === 0 ? 'EVEN' : 'ODD'
  } number!`;

  sendAutoText({
    trigger: 'HACKER_ROULETTE_SIMPLE',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendOddEvenClue;
