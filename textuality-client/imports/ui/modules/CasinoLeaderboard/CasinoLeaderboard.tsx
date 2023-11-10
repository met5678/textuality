import React from 'react';
import './CasinoLeaderboard.css';

import RouletteChip from '../Roulette/RouletteChip';
import Players from '/imports/api/players';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';

const CasinoLeaderboard = () => {
  const isLoading = useSubscribe('players.basic');
  const players = useFind(() => Players.find({}, { sort: { money: -1 } }), []);
  const title = 'High Rollers';
  const displayTitle = title.split('').map((letter, index) => (
    <span key={index} className={index % 2 === 0 ? '' : 'red'}>
      {letter}
    </span>
  ));

  return (
    <div className="leaderboard-casino">
      <div className="leaderboard-title">{displayTitle}</div>
      <div className="leaderboard-window">
        <div className="leaderboard-body">
          {players.map((player, i) => (
            <div key={player._id} className="leaderboard-row">
              <div className="leaderboard-img">
                <RouletteChip avatar_id={player.avatar!} zoom={1} />
              </div>
              <p className="leaderboard-item">{player.alias} </p>
              <p className="leaderboard-value">{player.money} BB</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CasinoLeaderboard;
