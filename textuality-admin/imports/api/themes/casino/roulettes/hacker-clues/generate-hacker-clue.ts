import sendLastDigitClue from './send-last-digit-clue';
import sendOverUnderClue from './send-overunder-clue';
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

  const clues = [sendLastDigitClue, sendOverUnderClue];

  const clue = clues[Math.floor(Math.random() * clues.length)];
  clue(result, player_id);
};

export default generateHackerClue;
