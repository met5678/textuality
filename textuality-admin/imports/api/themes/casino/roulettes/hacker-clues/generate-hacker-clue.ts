import sendDivisibleByClue from './send-divisible-by-clue';
import sendEliminationClue from './send-elimination-clue';
import sendLastDigitClue from './send-last-digit-clue';
import sendOddEvenClue from './send-odd-even-clue';
import sendSequenceClue from './send-sequence-clue';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { Roulette } from '/imports/schemas/roulette';

const generateHackerClue = ({
  roulette,
  player,
}: {
  roulette: Roulette;
  player: PlayerWithHelpers;
}) => {
  const result = roulette.result;
  const player_id = player._id!;

  if (!result) return;

  const clues = [sendLastDigitClue, sendDivisibleByClue, sendOddEvenClue];

  const clue = clues[Math.floor(Math.random() * clues.length)];
  clue(result, player_id);
};

export default generateHackerClue;
