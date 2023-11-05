import React from 'react';
import Roulette from '/imports/schemas/roulette';

interface RouletteScreenProps {
  event: Partial<Event>;
}

const RouletteScreen = ({ event }: RouletteScreenProps) => {
  return (
    <>
      <Roulette roulette={{}} />
    </>
  );
};

export default RouletteScreen;
