import React from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { withTracker } from 'meteor/react-meteor-data';

import Missions from 'api/missions';
import MissionPairings from 'api/missionPairings';

import SuccessfulPairings from './SuccessfulPairings';

const MissionOverlay = ({ event, mission }) => {
  const classNames = classnames({
    missionOverlay: true,
    active: !!mission
  });

  return (
    <div className={classNames}>
      {mission && (
        <>
          <div className="missionOverlay-title">Mission Active</div>
          <Countdown
            date={mission.timeEnd}
            intervalDelay={10}
            precision={2}
            renderer={({ minutes, seconds, milliseconds }) => (
              <div className="missionOverlay-countdown">
                {minutes}:{String(seconds).padStart(2, '0')}:
                {String(Math.floor(milliseconds / 10)).padStart(2, '0')}
              </div>
            )}
          />
          <div className="missionOverlay-directions">
            Check Phone for Assignment
          </div>
          <SuccessfulPairings mission={mission} />
        </>
      )}{' '}
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [Meteor.subscribe('missions.active')];

  const mission = Missions.findOne({ active: true });

  return {
    loading: handles.some(handle => !handle.ready()),
    mission
  };
})(MissionOverlay);
