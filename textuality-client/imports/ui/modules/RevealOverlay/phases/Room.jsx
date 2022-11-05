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
      return `In the ${name}?`;
    case 'no':
      return `Nope!`;
    case 'yes':
      return `In the ${name}!`;
  }
};

const RevealRoom = ({ revealState }) => {
  const { phase, currentClue, currentPlayers } = revealState;
  const phaseParts = phase.split('-');
  const part = phaseParts[1];

  const clue = currentClue ? Clues.findOne({ shortName: currentClue }) : null;
  const players = currentPlayers;

  return (
    <div className="revealOverlay-room-container">
      {part === 'intro' && (
        <div className="revealOverlay-room-intro-title">
          WHERE did the murder take place?
        </div>
      )}
      {part !== 'intro' && (
        <>
          <div className="revealOverlay-room-image-container">
            <img src={clue.getRevealImageUrl()} />
          </div>
          <div className="revealOverlay-room-name">
            {getClueText(part, clue.name)}
          </div>
          <div className="revealOverlay-players">
            {currentPlayers.map((player) => (
              <>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
                <div className="revealOverlay-player">
                  <img
                    src={getImageUrl(player.avatar, {
                      width: 75,
                      height: 75,
                      crop: 'thumb',
                      gravity: 'face',
                      zoom: 0.75,
                    })}
                  />
                </div>
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RevealRoom;
