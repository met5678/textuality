import React from 'react';
import Roulette from '../modules/Roulette/Roulette';
// import Roulette from '/imports/schemas/roulette';

interface RouletteScreenProps {
  event: Partial<Event>;
}

const RouletteScreen = ({ event }: RouletteScreenProps) => {
  return (
    <>
      <Roulette
        roulette={{
          status: 'pre-spin',
          cost: 50,
          result: 32,
          _id: '121323',
        }}
      />
    </>
  );
};

export default RouletteScreen;
