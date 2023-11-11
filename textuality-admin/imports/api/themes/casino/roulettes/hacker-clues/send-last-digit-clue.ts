import { Meteor } from 'meteor/meteor';

const sendLastDigitClue = (result: number, player_id: string) => {
  const lastDigit = result % 10;

  let eliminationDigit: number;
  do {
    eliminationDigit = Math.floor(Math.random() * 10);
  } while (eliminationDigit === lastDigit);

  const clueText = `The last digit's not gonna be a *${eliminationDigit}*!`;

  console.log('Sending last digit clue text', clueText);

  Meteor.call('autoTexts.send', {
    trigger: 'HACKER_ROULETTE_SIMPLE',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendLastDigitClue;
