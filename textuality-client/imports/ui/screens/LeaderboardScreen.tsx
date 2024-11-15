import React from 'react';
import Roulette from '../modules/Roulette/Roulette';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Roulettes from '/imports/api/themes/casino/roulettes';
import CasinoLeaderboard from '../modules/CasinoLeaderboard/CasinoLeaderboard';
import './LeaderboardScreen.css';

interface LeaderboardScreenProps {
  event: Event;
}

const LeaderboardScreen = ({ event }: LeaderboardScreenProps) => {
  //  ROO HELP - Skin does exist??
  return (
    <div className={`rouletteScreen leaderboardScreen ${event.skin}`}>
      <CasinoLeaderboard skin={event.skin} />
    </div>
  );
};

export default LeaderboardScreen;
