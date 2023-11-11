import React from 'react';
import Roulette from '../modules/Roulette/Roulette';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Roulettes from '/imports/api/themes/casino/roulettes';
import CasinoLeaderboard from '../modules/CasinoLeaderboard/CasinoLeaderboard';
import './LeaderboardScreen.css';

interface LeaderboardScreenProps {
  event: Partial<Event>;
}

const LeaderboardScreen = ({ event }: LeaderboardScreenProps) => {
  return (
    <div className="rouletteScreen leaderboardScreen">
      <CasinoLeaderboard />
    </div>
  );
};

export default LeaderboardScreen;
