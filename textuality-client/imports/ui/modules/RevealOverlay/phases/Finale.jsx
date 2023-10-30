import React, { useCallback } from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Clues from 'api/clues';
import { getImageUrl } from 'services/cloudinary';

const capitalizeFirstLetter = (str) =>
  `${str[0].toUpperCase()}${str.substring(1)}`;

const RoomBox = ({ solution }) => (
  <div className="solution-box">
    <div className="solution-media-container">
      <img src={`/reveal-images/room/${solution.room}.jpg`} />
    </div>
    <div className="solution-box-type">Room</div>
    <div className="solution-box-value">
      The <span className="red">{capitalizeFirstLetter(solution.room)}</span>
    </div>
  </div>
);

const SuspectBox = ({ solution }) => {
  const videoUrl = `/videos/person/textuality-${solution.person}-mugshot.mp4`;

  return (
    <div className="solution-box">
      <div className="solution-media-container">
        <video src={videoUrl} autoPlay muted />
      </div>
      <div className="solution-box-type">Murderer</div>
      <div className="solution-box-value blue">
        {capitalizeFirstLetter(solution.person)}
      </div>
    </div>
  );
};

const WeaponBox = ({ solution }) => (
  <div className="solution-box">
    <div className="solution-media-container">
      <img src={`/reveal-images/weapons/${solution.weapon}.png`} />
    </div>
    <div className="solution-box-type">Weapon</div>
    <div className="solution-box-value">
      The <span className="red">{capitalizeFirstLetter(solution.weapon)}</span>
    </div>
  </div>
);

const PlayerList = ({ currentPlayers, part }) => {
  const classes = classnames({
    'revealOverlay-players': true,
    [part]: true,
  });

  return (
    <div className={classes}>
      {currentPlayers.map((player) => (
        <div key={player.id} className="revealOverlay-player">
          <img
            src={getImageUrl(player.avatar, {
              width: 75,
              height: 75,
              crop: 'thumb',
              gravity: 'face',
              zoom: 1,
            })}
          />
        </div>
      ))}
    </div>
  );
};

const RevealRoom = ({ revealState, solution }) => {
  const { phase, currentClue, currentPlayers } = revealState;
  const phaseParts = phase.split('-');
  const part = phaseParts[1];

  const classes = classnames({
    'revealOverlay-finale-container': true,
    [part]: true,
  });

  return (
    <div className={classes}>
      {part === 'intro' && (
        <div className="revealOverlay-suspect-intro-title">
          So who got <span className="red">EVERYTHING</span> right?
        </div>
      )}
      {part !== 'intro' && (
        <>
          <div className="solution-boxes">
            <RoomBox solution={solution} />
            <SuspectBox solution={solution} />
            <WeaponBox solution={solution} />
          </div>
          <PlayerList currentPlayers={currentPlayers} part={part} />
        </>
      )}
    </div>
  );
};

export default RevealRoom;
