import React from 'react';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import MissionPairings from 'api/missionPairings';

import Pairing from './Pairing';

const SuccessfulPairings = ({ loading, pairings }) => {
  if (loading || pairings.length === 0) return null;

  const [pairing, setPairing] = React.useState(null);

  const pairingQueue = React.useRef([]);
  const oldQueue = React.useRef([]);

  const changeTimeout = React.useCallback(() => {
    if (pairingQueue.current.length) {
      const newPairing = pairingQueue.current.shift();

      oldQueue.current.unshift(newPairing);
      while (oldQueue.current.length > 6) oldQueue.current.pop();

      setPairing(newPairing);
      setTimeout(changeTimeout, 12000);
    } else {
      setPairing(null);
    }
  });

  React.useEffect(() => {
    // Go through pairings backwards to preserve order
    for (let i = pairings.length - 1; i >= 0; i--) {
      const newPairing = pairings[i];

      // If this pairing is already in the queue, skip
      if (
        pairingQueue.current.some(u => u._id === newPairing._id) ||
        oldQueue.current.some(u => u._id === newPairing._id)
      ) {
        continue;
      }

      pairingQueue.current.push(newPairing);
    }

    if (!pairing) {
      changeTimeout();
    }
  }, [pairings]);

  return (
    <div className={classnames({ pairingsBox: true, active: !!pairing })}>
      {pairing && <Pairing pairing={pairing} />}
    </div>
  );
};

export default withTracker(({ mission }) => {
  const handles = [
    Meteor.subscribe('missionPairings.latestForMission', {
      mission: mission._id,
      n: 10
    })
  ];

  console.log();

  return {
    loading: handles.some(handle => !handle.ready()),
    pairings: MissionPairings.find({
      mission: mission._id,
      complete: true
    }).fetch()
  };
})(SuccessfulPairings);
