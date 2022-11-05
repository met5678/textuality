import Events from 'api/events';
import Players from 'api/players';

const getPlayersDict = () => {
  return Players.find({ event: Events.currentId() })
    .fetch()
    .reduce((acc, player) => {
      acc[player._id] = player;
      return acc;
    }, {});
};

export default getPlayersDict;
