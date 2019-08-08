import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Media from 'api/media';

const FeedImage = ({ loading, media }) => {
  if (loading) {
    return null;
  }

  media = media.reverse();

  return (
    <>
      {media.map(image => (
        <img key={image._id} src={image.getFeedUrl()} className="feedImage" />
      ))}
    </>
  );
};

export default withTracker(({ event }) => {
  const handles = [Meteor.subscribe('media.feed', 3)];

  return {
    loading: handles.some(handle => !handle.ready()),
    media: Media.find({ purpose: 'feed' }, { sort: { time: -1 } }).fetch()
  };
})(FeedImage);
