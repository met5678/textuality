import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';

const sendEliminationClue = (result: number, player_id: string) => {
  let eliminationNumber: number;
  do {
    eliminationNumber = Math.floor(Math.random() * 37);
  } while (eliminationNumber === result);

  const clueText = `The spin's not gonna land on *${eliminationNumber}*!`;

  sendAutoText({
    trigger: 'HACKER_ROULETTE_SIMPLE',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendEliminationClue;
