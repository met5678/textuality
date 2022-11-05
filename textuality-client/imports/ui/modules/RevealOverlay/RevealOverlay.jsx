import React, { useCallback } from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Rounds from 'api/rounds';

const RevealOverlay = ({ event, mission }) => {
  const isLoading = useSubscribe('rounds.current');
  const round = useTracker(() => Rounds.current());

  console.log('ROUND OVERLAY', {
    round,
    revealState: round?.revealState,
    phase: round?.revealState?.phase,
  });

  if (isLoading()) return null;
  if (!round || round.status !== 'reveal' || !round.revealState) return null;

  const revealState = round.revealState;
  console.log({ revealState });

  const classNames = {
    revealOverlay: true,
    [revealState.phase]: true,
  };

  return (
    <div className={classNames}>
      <div className="missionOverlay-title">Reveal Active</div>
      <div className="missionOverlay-directions">{revealState.phase}</div>
    </div>
  );
};

export default RevealOverlay;
