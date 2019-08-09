import React from 'react';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import Achievements from 'api/achievements';
import AchievementUnlocks from 'api/achievementUnlocks';

import Hearts from 'generic/Hearts';

import AchievementSquare from './AchievementSquare';

const AchievementBox = ({ loading, unlocks, totalAchievements }) => {
  if (loading || unlocks.length === 0) return null;

  const [unlock, setUnlock] = React.useState(null);

  const unlockQueue = React.useRef([]);
  const oldQueue = React.useRef([]);

  const changeTimeout = React.useCallback(() => {
    if (unlockQueue.current.length) {
      const newUnlock = unlockQueue.current.shift();

      oldQueue.current.unshift(newUnlock);
      while (oldQueue.current.length > 6) oldQueue.current.pop();

      setUnlock(newUnlock);
      setTimeout(changeTimeout, 9500);
    } else {
      setUnlock(null);
    }
  });

  React.useEffect(() => {
    // Go through unlocks backwards to preserve order
    for (let i = unlocks.length - 1; i >= 0; i--) {
      const newUnlock = unlocks[i];

      // If this unlock is already in the queue, skip
      if (
        unlockQueue.current.some(u => u._id === newUnlock._id) ||
        oldQueue.current.some(u => u._id === newUnlock._id)
      ) {
        continue;
      }

      unlockQueue.current.push(newUnlock);
    }

    if (!unlock) {
      changeTimeout();
    }
  }, [unlocks]);

  return (
    <div className="achievementsBox" style={{ opacity: !!unlock ? 1 : 0 }}>
      {unlock && (
        <AchievementSquare
          unlock={unlock}
          totalAchievements={totalAchievements}
        />
      )}
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [
    Meteor.subscribe('achievementUnlocks.latest', 5),
    Meteor.subscribe('achievements.basic')
  ];

  return {
    loading: handles.some(handle => !handle.ready()),
    unlocks: AchievementUnlocks.find(
      {},
      { sort: { time: -1 }, limit: 5 }
    ).fetch(),
    totalAchievements: Achievements.find().count()
  };
})(AchievementBox);
