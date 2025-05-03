import React from 'react';
import './DerbyLeaderboard.css';

import DerbyPlayerCircle from '../HorseRace/subscreens/RaceResults/DerbyPlayerCircle';
import Players from '/imports/api/players';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import commaNumber from 'comma-number';
import { Event } from '/imports/schemas/event';
const DerbyLeaderboard = ({ event }: { event: Event }) => {
  const isLoading = useSubscribe('players.basic');
  const players = useFind(
    () => Players.find({}, { sort: { money: -1 }, limit: 12 }),
    [],
  );
  const title = 'High Rollers';
  const displayTitle = title.split('').map((letter, index) => (
    <span key={index} className={index % 2 === 0 ? 'evenLetter' : 'oddLetter'}>
      {letter}
    </span>
  ));

  if (isLoading()) return null;

  return (
    <div className={`leaderboard-derby`}>
      <div className="leaderboard-title">{displayTitle}</div>
      <div className="leaderboard-window">
        <div className="leaderboard-body">
          {players.map((player, i) => (
            <div key={player._id} className="leaderboard-row">
              <div className="leaderboard-img">
                <DerbyPlayerCircle
                  player={player}
                  zoom={1}
                  width={100}
                  height={100}
                />
              </div>
              <p className="leaderboard-item">{player.alias} </p>
              <p className="leaderboard-value">
                {commaNumber(player.money)} DD
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DerbyLeaderboard;
