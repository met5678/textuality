import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import InTexts from 'api/inTexts';

import FeedItem from './FeedItem';
import FeedImage from './FeedImage';

const Feed = ({ loading, inTexts }) => {
  if (loading) {
    return null;
  }

  return (
    <div className="feed">
      <FeedImage />
      {inTexts.map(inText => (
        <FeedItem inText={inText} key={inText._id} />
      ))}
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [Meteor.subscribe('inTexts.feed', 10)];

  return {
    loading: handles.some(handle => !handle.ready()),
    inTexts: InTexts.find({ purpose: 'feed' }, { sort: { time: -1 } }).fetch()
  };
})(Feed);
