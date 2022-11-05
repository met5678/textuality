import React from 'react';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import Achievements from 'api/achievements';
import Players from 'api/players';

import Hearts from 'generic/Hearts';
import arraySort from 'array-sort';

const titles = ['Clues Obtained', 'Evidence Found'];
const attributes = ['numClues', 'checkpoints'];

const Leaderboard = ({ loading, players, achievements }) => {
  const [mode, setMode] = React.useState(0);

  const changeMode = React.useCallback(() => setMode((mode + 1) % 3));

  React.useEffect(() => {
    const interval = setInterval(changeMode, 15000);
    return () => clearInterval(interval);
  });

  const orderedPlayers = arraySort(players, attributes[mode]);

  if (loading) return null;

  return (
    <div className="leaderboardsBox">
      <div className="leaderboard">
        <div className="leaderboard-title">{titles[mode]}</div>
        <div className="leaderboard-body">
          {orderedPlayers.map((player, i) => (
            <div key={player._id} className="leaderboard-row">
              <span className="leaderboard-item">{player.alias} </span>
              <span className="leaderboard-value">
                {Array.isArray(player[attributes[mode]])
                  ? player[attributes[mode]].length
                  : player[attributes[mode]]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [
    Meteor.subscribe('players.basic'),
    Meteor.subscribe('achievements.basic'),
  ];

  return {
    loading: handles.some((handle) => !handle.ready()),
    achievements: Achievements.find().fetch(),
    players: Players.find().fetch(),
  };
})(Leaderboard);
