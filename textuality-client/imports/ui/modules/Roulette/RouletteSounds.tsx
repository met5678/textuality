import React, { useEffect, useState } from 'react';
import { RouletteWithHelpers } from '/imports/api/themes/casino/roulettes/roulettes';

const RouletteSounds = ({
  roulette,
}: {
  roulette: Partial<RouletteWithHelpers>;
}) => {
  const { status } = roulette;

  if (status === 'spinning')
    return <audio src="/casino/sounds/roulette-spin.ogg" autoPlay />;

  if (status === 'end-spin')
    return <audio src="/casino/sounds/roulette-spin-end.ogg" autoPlay />;
  return null;
};

export default RouletteSounds;
