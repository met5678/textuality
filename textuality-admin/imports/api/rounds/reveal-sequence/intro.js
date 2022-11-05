import Events from 'api/events';
import Rounds from '../rounds';

import Guesses from 'api/guesses';
import Players from 'api/players';
import ClueRewards from 'api/clueRewards';

import waitForSeconds from './_wait-for-seconds';

const doIntro = async (roundId) => {
  // const guessesSubmitted = Guesses.find({ round: roundId }).count();
  // const evidenceFound = Players.find({ event: Events.currentId() })
  //   .fetch()
  //   .reduce((acc, player) => acc + player.checkpoints.length, 0);
  // const cluesCollected = ClueRewards.find({ round: roundId }).count();

  Rounds.update(roundId, {
    $set: {
      'revealState.phase': 'intro',
      // 'revealState.evidenceFound': evidenceFound,
      // 'revealState.guessesSubmitted': guessesSubmitted,
      // 'revealState.cluesCollected': cluesCollected,
    },
  });
  await waitForSeconds(10);

  // Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-evidence' } });
  // await waitForSeconds(5);

  // Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-clues' } });
  // await waitForSeconds(5);

  // Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-guesses' } });
  // await waitForSeconds(5);
};

export default doIntro;
