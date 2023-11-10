import React from 'react';
import './CasinoLeaderboard.css';

import Players from '/imports/api/players';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

const CasinoLeaderboard = () => {
  const isLoading = useSubscribe('players.basic');
  const players = useFind(() => Players.find({}, { sort: { money: -1 } }), []);

  return (
    <div className="leaderboard-casino">
      <div className="leaderboard-title">🎲 High Rollers 🎲</div>
      <div className="leaderboard-window">
        <div className="leaderboard-body">
          {players.map((player, i) => (
            <div key={player._id} className="leaderboard-row">
              <img
                src={getImageUrl(player.avatar!, { width: 100, height: 100 })}
              />
              <span className="leaderboard-item">{player.alias} </span>
              <span className="leaderboard-value">{player.money} BB</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CasinoLeaderboard;
