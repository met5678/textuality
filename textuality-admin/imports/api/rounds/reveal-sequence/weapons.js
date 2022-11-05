import Events from 'api/events';
import Rounds from '../rounds';

import Guesses from 'api/guesses';
import Clues from 'api/clues';
import Players from 'api/players';

import arraySort from 'array-sort';

import waitForSeconds from './_wait-for-seconds';

const getWeaponsWithGuesses = (roundId) => {
  const weaponClues = Clues.find({
    event: Events.currentId(),
    type: 'weapon',
  }).fetch();

  const guesses = Guesses.find({ round: roundId }).fetch();
  const playersDict = Players.find({ event: Events.currentId() })
    .fetch()
    .reduce((acc, player) => {
      acc[player._id] = player;
      return acc;
    }, {});

  const solutionWeapon = Rounds.findOne(roundId).solution.weapon;

  const weaponsWithGuesses = arraySort(
    weaponClues.flatMap((weaponClue) => {
      const guessesForWeapon = arraySort(
        guesses.filter((guess) => guess.weapon === weaponClue.shortName),
        'timeWeapon'
      );

      if (
        guessesForWeapon.length === 0 &&
        weaponClue.shortName !== solutionWeapon
      )
        return [];

      const guessPlayers = guessesForWeapon.map((guess) => {
        const player = playersDict[guess.player];
        return {
          id: player._id,
          alias: player.alias,
          avatar: player.avatar,
        };
      });

      return [
        {
          currentClue: weaponClue.shortName,
          currentPlayers: guessPlayers,
          numPlayers: guessPlayers.length,
          isSolutionWeapon: weaponClue.shortName === solutionWeapon,
        },
      ];
    }),
    ['isSolutionWeapon', 'numPlayers']
  );

  return weaponsWithGuesses;
};

const doWeapons = async (roundId) => {
  const weaponsWithGuesses = getWeaponsWithGuesses(roundId);

  Rounds.update(roundId, {
    $set: { 'revealState.phase': 'weapon-intro' },
    $unset: {
      'revealState.currentClue': 1,
      'revealState.currentPlayers': 1,
    },
  });
  await waitForSeconds(10);

  for (const weaponWithGuesses of weaponsWithGuesses) {
    Rounds.update(roundId, {
      $set: {
        'revealState.phase': 'weapon-present',
        'revealState.currentClue': weaponWithGuesses.currentClue,
        'revealState.currentPlayers': weaponWithGuesses.currentPlayers,
      },
    });
    await waitForSeconds(5);

    if (!weaponWithGuesses.isSolutionWeapon) {
      Rounds.update(roundId, { $set: { 'revealState.phase': 'weapon-no' } });
      await waitForSeconds(5);
    } else {
      Rounds.update(roundId, { $set: { 'revealState.phase': 'weapon-yes' } });
      await waitForSeconds(15);
    }
  }
};

export default doWeapons;
