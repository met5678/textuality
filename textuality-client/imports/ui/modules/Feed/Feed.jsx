import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import InTexts from 'api/inTexts';

import FeedItem from './FeedItem';

const Feed = ({ loading, inTexts }) => {
  if (loading) {
    return null;
  }

  console.log(inTexts);

  return (
    <div className="feed">
      {inTexts.map(inText => (
        <FeedItem inText={inText} key={inText._id} />
      ))}
    </div>
  );
};

export default withTracker(({ event }) => {
  const handles = [Meteor.subscribe('inTexts.feed', 20)];

  return {
    loading: handles.some(handle => !handle.ready()),
    inTexts: InTexts.find({}, { sort: { time: -1 } }).fetch()
  };
})(Feed);
