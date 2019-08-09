import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import InTexts from 'api/inTexts';
import Achievements from 'api/achievements';

import FeedItem from './FeedItem';
import FeedImage from './FeedImage';

const Feed = ({ loading, inTexts, totalAchievements }) => {
  if (loading) {
    return null;
  }

  return (
    <div className="feed">
      <FeedImage />
      {inTexts.map(inText => (
        <FeedItem
          inText={inText}
          key={inText._id}
          totalAchievements={totalAchievements}
        />
      ))}
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [
    Meteor.subscribe('inTexts.feed', 10),
    Meteor.subscribe('achievements.basic')
  ];

  return {
    loading: handles.some(handle => !handle.ready()),
    inTexts: InTexts.find({ purpose: 'feed' }, { sort: { time: -1 } }).fetch(),
    totalAchievements: Achievements.find().count()
  };
})(Feed);
