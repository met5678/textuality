import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Hearts from 'generic/Hearts';

const FeedItem = ({ inText, totalAchievements }) => {
  const emojiClass = inText.bigEmojiOnFeed() ? 'emojiOnly' : '';

  return (
    <div className="feedItem">
      <aside className="feedItem-player">
        <img src={inText.getAvatarUrl(100)} className="feedItem-avatar" />
        <div className="feedItem-player-text">
          <p className="feedItem-alias">{inText.alias}</p>
          <Hearts
            className="feedItem-achievements"
            unlocks={inText.numAchievements}
            totalAchievements={totalAchievements}
            sparkleOnFull={true}
          />
        </div>
      </aside>
      <p className={`feedItem-body ${emojiClass}`}>{inText.body}</p>
    </div>
  );
};

export default FeedItem;
