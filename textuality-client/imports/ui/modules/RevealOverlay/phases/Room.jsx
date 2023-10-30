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
          Was it in the <span className="yellow">{name}</span>?
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
          In the <span className="green">{name}</span>!
        </>
      );
  }
};

const RoomImage = ({ part, clue }) => {
  const classes = classnames({
    'revealOverlay-room-image-container': true,
    [part]: true,
  });
  return (
    <div className={classes}>
      <img src={clue.getRevealImageUrl()} />
    </div>
  );
};

const RoomName = ({ part, clue }) => (
  <div className="revealOverlay-room-name">{getClueText(part, clue.name)}</div>
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
  const players = currentPlayers;

  const classes = classnames({
    'revealOverlay-room-container': true,
    [part]: true,
  });

  return (
    <div className={classes}>
      {part === 'intro' && (
        <div className="revealOverlay-room-intro-title">
          <span className="red">WHERE</span> did the murder take place?
        </div>
      )}
      {part !== 'intro' && (
        <>
          <RoomImage clue={clue} part={part} />
          <RoomName clue={clue} part={part} />
          <PlayerList currentPlayers={currentPlayers} clue={clue} part={part} />
        </>
      )}
    </div>
  );
};

export default RevealRoom;
