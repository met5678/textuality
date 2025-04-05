import React, { useEffect, useRef, useState } from 'react';
import RacePixiRoot from './RacePixi/RacePixiWrapper';
import RacePixiWrapper from './RacePixi/RacePixiWrapper';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';

export const RaceActiveSubsceen: React.FC<{ race: RaceWithHelpers }> = ({
  race,
}) => {
  return (
    <div id="horse-race-active">
      <RacePixiWrapper race={race} />
    </div>
  );
};
