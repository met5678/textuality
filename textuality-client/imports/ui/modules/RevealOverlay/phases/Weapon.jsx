import React, { useCallback } from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Clues from 'api/clues';
import { getImageUrl } from 'services/cloudinary';

const getClueText = (part, name) => {
  switch (part) {
    case 'intro':
      return null;
    case 'present':
      return (
        <>
          Was it the <span className="yellow">{name}</span>?
        </>
      );
    case 'no':
      return (
        <>
          Nope! Not the <span className="red">{name}</span>.
        </>
      );
    case 'yes':
      return (
        <>
          Yes! It was the <span className="green">{name}</span>!
        </>
      );
  }
};

const WeaponVideo = ({ part, clue, solution }) => {
  const classes = classnames({
    'revealOverlay-weapon-video-container': true,
    [part]: true,
  });

  const videoName = {
    no: `textuality-${solution.person}-no`,
    yes: `textuality-${solution.person}-${solution.weapon}-murder`,
    present: `textuality-${solution.person}-${clue.shortName}-display`,
  };

  const videoUrl = `/videos/person/${videoName[part]}.mp4`;

  return (
    <div className={classes}>
      <video src={videoUrl} autoPlay muted />
    </div>
  );
};

const WeaponName = ({ part, clue }) => (
  <div className="revealOverlay-weapon-name">
    {getClueText(part, clue.name)}
  </div>
);

const PlayerList = ({ currentPlayers, clue, part }) => {
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
              width: 60,
              height: 60,
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

  const clue = currentClue ? Clues.findOne({ shortName: currentClue }) : null;

  const classes = classnames({
    'revealOverlay-weapon-container': true,
    [part]: true,
  });

  return (
    <div className={classes}>
      {part === 'intro' && (
        <div className="revealOverlay-weapon-intro-title">
          Which <span className="red">WEAPON</span> was used?
        </div>
      )}
      {part !== 'intro' && (
        <>
          <WeaponVideo clue={clue} part={part} solution={solution} />
          <WeaponName clue={clue} part={part} />
          <PlayerList currentPlayers={currentPlayers} clue={clue} part={part} />
        </>
      )}
    </div>
  );
};

export default RevealRoom;
