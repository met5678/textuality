import Events from 'api/events';
import Rounds from '../rounds';

import Guesses from 'api/guesses';
import Players from 'api/players';
import ClueRewards from 'api/clueRewards';

import waitForSeconds from './_wait-for-seconds';

const doIntro = async (roundId) => {
  const guessesSubmitted = Guesses.find({ round: roundId }).count();
  const evidenceFound = Players.find({ event: Events.currentId() })
    .fetch()
    .reduce((acc, player) => acc + player.checkpoints.length, 0);
  const cluesCollected = ClueRewards.find({ round: roundId }).count();

  Rounds.update(roundId, {
    $set: {
      'revealState.phase': 'intro',
      'revealState.evidenceFound': evidenceFound,
      'revealState.guessesSubmitted': guessesSubmitted,
      'revealState.cluesCollected': cluesCollected,
    },
  });
  console.log('Waiting for 10....');
  await waitForSeconds(10);
  console.log('Waited for 10');

  console.log('pre intro-evidence');
  Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-evidence' } });
  console.log('post intro-evidence');
  await waitForSeconds(5);

  console.log('pre intro-clues');
  Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-clues' } });
  console.log('post intro-clues');
  await waitForSeconds(5);

  console.log('pre intro-guesses');
  Rounds.update(roundId, { $set: { 'revealState.phase': 'intro-guesses' } });
  console.log('post intro-guesses');
  await waitForSeconds(5);
};

export default doIntro;
