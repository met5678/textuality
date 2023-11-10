import React, { useEffect, useState } from 'react';
import { RouletteWithHelpers } from '/imports/api/themes/casino/roulettes/roulettes';

const RouletteSounds = ({
  roulette,
}: {
  roulette: Partial<RouletteWithHelpers>;
}) => {
  const { status, bets_open } = roulette;

  return (
    <>
      {status === 'pre-spin' && (
        <audio src="/casino/sounds/roulette-bets-open.ogg" autoPlay />
      )}
      {status === 'spinning' && (
        <audio src="/casino/sounds/roulette-spin.ogg" autoPlay />
      )}
      {status === 'end-spin' && (
        <audio src="/casino/sounds/roulette-spin-end.ogg" autoPlay />
      )}
      {status === 'winners-board' && (
        <audio src="/casino/sounds/roulette-winnerboard.ogg" autoPlay />
      )}
      {status === 'spinning' && !bets_open && (
        <audio
          src={`/casino/sounds/roulette-bets-close-${
            Math.round(Math.random()) + 1
          }.ogg`}
          autoPlay
        />
      )}
    </>
  );
};

export default RouletteSounds;
