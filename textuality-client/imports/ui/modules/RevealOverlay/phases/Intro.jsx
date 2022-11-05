import React, { useCallback } from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Rounds from 'api/rounds';

const RevealIntro = ({ revealState }) => {
  return (
    <div className="revealOverlay-intro-container">
      <div className="revealOverlay-intro-clueTitle">
        C<span className="clue-l">l</span>ue
      </div>
      <div className="revealOverlay-intro-revealTitle">
        The MURDER has been solved!
      </div>
    </div>
  );
};

export default RevealIntro;
