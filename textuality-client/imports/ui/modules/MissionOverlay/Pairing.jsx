import React from 'react';
import classnames from 'classnames';
import { withTracker } from 'meteor/react-meteor-data';

import Hearts from 'generic/Hearts';

const Pairing = ({ loading, pairing, totalAchievements }) => {
  return (
    <div className="pairing">
      <div className="pairing-player pairing-b">
        <img className="pairing-avatar" src={pairing.getAvatarUrlA()} />
        <div className="pairing-alias">{pairing.aliasA}</div>
      </div>
      <Hearts
        className="pairing-hearts"
        unlocks={2}
        totalAchievements={2}
        flashLatest={false}
        sparkleOnFull={true}
      />
      <div className="pairing-player pairing-b">
        <img className="pairing-avatar" src={pairing.getAvatarUrlB()} />
        <div className="pairing-alias">{pairing.aliasB}</div>
      </div>
    </div>
  );
};

export default Pairing;
