import React, { useCallback } from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';

import Clues from 'api/clues';
import getImageUrl from 'services/get-image-url';

const getClueText = (part, name) => {
  switch (part) {
    case 'intro':
      return null;
    case 'present':
      return (
        <>
          Was it <span className="yellow">{name}</span>?
        </>
      );
    case 'no':
      return (
        <>
          Nope! Not <span className="red">{name}</span>.
        </>
      );
    case 'yes':
      return (
        <>
          It was <span className="green">{name}</span>!
        </>
      );
  }
};

const SuspectVideo = ({ part, clue }) => {
  const classes = classnames({
    'revealOverlay-suspect-video-container': true,
    [part]: true,
  });

  const videoWord = {
    no: 'no',
    yes: 'evil',
    present: 'accused',
  };

  const videoUrl = `/videos/person/textuality-${clue.shortName}-${videoWord[part]}.mp4`;

  return (
    <div className={classes}>
      <video src={videoUrl} autoPlay muted />
    </div>
  );
};

const SuspectName = ({ part, clue }) => (
  <div className="revealOverlay-suspect-name">
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

const RevealRoom = ({ revealState }) => {
  const { phase, currentClue, currentPlayers } = revealState;
  const phaseParts = phase.split('-');
  const part = phaseParts[1];

  const clue = currentClue ? Clues.findOne({ shortName: currentClue }) : null;

  const classes = classnames({
    'revealOverlay-suspect-container': true,
    [part]: true,
  });

  return (
    <div className={classes}>
      {part === 'intro' && (
        <div className="revealOverlay-suspect-intro-title">
          <span className="red">WHO</span> committed the murder?
        </div>
      )}
      {part !== 'intro' && (
        <>
          <SuspectVideo clue={clue} part={part} />
          <SuspectName clue={clue} part={part} />
          <PlayerList currentPlayers={currentPlayers} clue={clue} part={part} />
        </>
      )}
    </div>
  );
};

export default RevealRoom;
