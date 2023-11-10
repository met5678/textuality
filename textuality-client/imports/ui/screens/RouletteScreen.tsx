import React from 'react';
import Roulette from '../modules/Roulette/Roulette';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Roulettes from '/imports/api/themes/casino/roulettes';
// import Roulette from '/imports/schemas/roulette';

interface RouletteScreenProps {
  event: Partial<Event>;
}

const RouletteScreen = ({ event }: RouletteScreenProps) => {
  const isLoading = useSubscribe('roulettes.currentOrNext');
  const roulettes = useFind(() => Roulettes.find(), []);
  const roulette = roulettes[0];

  if (!roulette) return 'No roulette';

  return (
    <div className="rouletteScreen">
      <Roulette roulette={roulette} />
    </div>
  );
};

export default RouletteScreen;
