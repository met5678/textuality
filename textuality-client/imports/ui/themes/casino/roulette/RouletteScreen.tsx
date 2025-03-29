import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import React from 'react';
import Roulettes from '/imports/api/themes/casino/roulettes';
import { Event } from '/imports/schemas/event';
import Roulette from '/imports/ui/modules/Roulette/Roulette';
import LeaderboardScreen from '/imports/ui/screens/LeaderboardScreen';

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
