import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import AchievementUnlocks from 'api/achievementUnlocks';

const AchievementBox = ({ loading, unlocks }) => {
  if (loading || unlocks.length === 0) return null;

  const unlock = unlocks[0];

  return (
    <div className="achievementBox">
      <div className="achievementBox-title">
        <div className="achievementBox-au">- Achievement Unlocked -</div>
        <div className="achievementBox-name">{unlock.name}</div>
      </div>
      <div className="achievementBox-player">
        <img className="achievementBox-avatar" src={unlock.getAvatarUrl()} />
        <div className="achievementBox-alias">{unlock.alias}</div>
        <div className="achievementBox-hearts hearts">
          <span className="full" />
          <span className="full" />
          <span className="full" />
          <span className="half flash" />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [Meteor.subscribe('achievementUnlocks.latest', 10)];

  return {
    loading: handles.some(handle => !handle.ready()),
    unlocks: AchievementUnlocks.find({}, { sort: { time: -1 } }).fetch()
  };
})(AchievementBox);
