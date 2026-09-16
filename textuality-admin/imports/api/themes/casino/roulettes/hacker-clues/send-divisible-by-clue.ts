import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';

const DIVISORS = [3, 4, 5, 7];

const isDivisibleBy = (number: number, divisor: number) => {
  return number % divisor === 0;
};

const sendDivisibleByClue = (result: number, player_id: string) => {
  const divisor = DIVISORS[Math.floor(Math.random() * DIVISORS.length)];
  const divisibleBy = isDivisibleBy(result, divisor);

  const clueText = `The spin's result is ${
    divisibleBy ? '' : 'NOT'
  } gonna be divisible by *${divisor}*!`;

  console.log('Sending divisible by clue text', clueText);

  sendAutoText({
    trigger: 'HACKER_ROULETTE_MATH',
    playerId: player_id,
    templateVars: {
      clue_text: clueText,
    },
  });
};

export default sendDivisibleByClue;
