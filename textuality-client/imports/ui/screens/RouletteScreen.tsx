import React from 'react';
import { Event } from '/imports/schemas/event';
import Roulette from '../modules/Roulette/Roulette';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Roulettes from '/imports/api/themes/casino/roulettes';
import LeaderboardScreen from './LeaderboardScreen';
// import Roulette from '/imports/schemas/roulette';

interface RouletteScreenProps {
  event: Event;
}

const RouletteScreen = ({ event }: RouletteScreenProps) => {
  const isLoading = useSubscribe('roulettes.currentOrNext');
  const roulettes = useFind(() => Roulettes.find(), []);
  const roulette = roulettes[0];

  if (!roulette) return <LeaderboardScreen event={event} />;

  return (
    <div className={`rouletteScreen ${event.skin}`}>
      <Roulette roulette={roulette} skin={event.skin} />
    </div>
  );
};

export default RouletteScreen;
