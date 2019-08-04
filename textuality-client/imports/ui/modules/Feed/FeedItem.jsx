import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import InTexts from 'api/inTexts';

const FeedItem = ({ inText }) => {
  return (
    <div className="feedItem">
      <aside className="feedItem-player">
        <img src={inText.getAvatarUrl(60)} className="feedItem-avatar" />
        <div className="feedItem-player-text">
          <p className="feedItem-alias">{inText.alias}</p>
          <div className="feedItem-achievements">5 / 25</div>
        </div>
      </aside>
      <p className="feedItem-body">{inText.body}</p>
    </div>
  );
};

export default FeedItem;
