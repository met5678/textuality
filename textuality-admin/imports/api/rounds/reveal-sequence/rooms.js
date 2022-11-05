import Events from 'api/events';
import Rounds from '../rounds';

import Guesses from 'api/guesses';
import Clues from 'api/clues';
import Players from 'api/players';

import arraySort from 'array-sort';

import waitForSeconds from './_wait-for-seconds';

const getRoomWithGuesses = (roundId) => {
  const roomClues = Clues.find({
    event: Events.currentId(),
    type: 'room',
  }).fetch();

  const guesses = Guesses.find({ round: roundId }).fetch();
  const playersDict = Players.find({ event: Events.currentId() })
    .fetch()
    .reduce((acc, player) => {
      acc[player._id] = player;
      return acc;
    }, {});

  const solutionRoom = Rounds.findOne(roundId).solution.room;

  const roomsWithGuesses = arraySort(
    roomClues.flatMap((roomClue) => {
      const guessesForRoom = arraySort(
        guesses.filter((guess) => guess.room === roomClue.shortName),
        'timeRoom'
      );

      if (guessesForRoom.length === 0 && roomClue.shortName !== solutionRoom)
        return [];

      const guessPlayers = guessesForRoom.map((guess) => {
        const player = playersDict[guess.player];
        return {
          id: player._id,
          alias: player.alias,
          avatar: player.avatar,
        };
      });

      return [
        {
          currentClue: roomClue.shortName,
          currentPlayers: guessPlayers,
          numPlayers: guessPlayers.length,
          isSolutionRoom: roomClue.shortName === solutionRoom,
        },
      ];
    }),
    ['isSolutionRoom', 'numPlayers']
  );

  return roomsWithGuesses;
};

const doRooms = async (roundId) => {
  const roomsWithGuesses = getRoomWithGuesses(roundId);

  Rounds.update(roundId, {
    $set: { 'revealState.phase': 'room-intro' },
    $unset: {
      'revealState.currentClue': 1,
      'revealState.currentPlayers': 1,
    },
  });
  await waitForSeconds(10);

  for (const roomWithGuesses of roomsWithGuesses) {
    Rounds.update(roundId, {
      $set: {
        'revealState.phase': 'room-present',
        'revealState.currentClue': roomWithGuesses.currentClue,
        'revealState.currentPlayers': roomWithGuesses.currentPlayers,
      },
    });
    await waitForSeconds(10);

    if (!roomWithGuesses.isSolutionRoom) {
      Rounds.update(roundId, { $set: { 'revealState.phase': 'room-no' } });
      await waitForSeconds(60);
    } else {
      Rounds.update(roundId, { $set: { 'revealState.phase': 'room-yes' } });
      await waitForSeconds(10);
    }
  }
};

export default doRooms;
