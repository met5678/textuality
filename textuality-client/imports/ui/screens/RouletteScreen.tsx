import React from 'react';
import Roulette from '../modules/Roulette/Roulette';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Roulettes from '/imports/api/themes/casino/roulettes';
// import Roulette from '/imports/schemas/roulette';

interface RouletteScreenProps {
  event: Partial<Event>;
}

const RouletteScreen = ({ event }: RouletteScreenProps) => {
  const isLoading = useSubscribe('roulettes.current');
  const roulettes = useFind(() => Roulettes.find(), []);

  const roulette = roulettes[0];

  if (isLoading()) return 'Loading';

  if (!roulette) return 'No roulette';

  return (
    <>
      <Roulette roulette={roulette} />
    </>
  );
};

export default RouletteScreen;
