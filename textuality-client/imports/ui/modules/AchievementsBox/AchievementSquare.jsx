import React from 'react';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import Achievements from 'api/achievements';
import AchievementUnlocks from 'api/achievementUnlocks';

import Hearts from 'generic/Hearts';

const AchievementSquare = ({ loading, unlock, totalAchievements }) => {
  return (
    <div className="achievementSquare">
      <div className="achievementSquare-title">
        <div className="achievementSquare-au">- Achievement Unlocked -</div>
        <div className="achievementSquare-name">{unlock.name}</div>
      </div>
      <div className="achievementSquare-player">
        <img className="achievementSquare-avatar" src={unlock.getAvatarUrl()} />
        <div className="achievementSquare-alias">{unlock.alias}</div>
        <Hearts
          className="achievementSquare-hearts"
          unlocks={unlock.numAchievements}
          totalAchievements={totalAchievements}
          flashLatest={true}
          sparkleOnFull={true}
        />
      </div>
    </div>
  );
};

export default AchievementSquare;
