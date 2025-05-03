import React from 'react';
import './DerbyLeaderboard.css';

import DerbyPlayerCircle from '../HorseRace/subscreens/RaceResults/DerbyPlayerCircle';
import Players from '/imports/api/players';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import commaNumber from 'comma-number';
import { Event } from '/imports/schemas/event';
import {
  COLOR_DERBY_BEIGE,
  COLOR_DERBY_OFF_WHITE,
  COLOR_DERBY_BURGUNDY,
} from '../DerbyStyleVars';
import { FONT_FAMILY_BRIOSO, FONT_FAMILY_EUROSTILE } from '../DerbyStyleVars';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const DerbyLeaderboard = ({ event }: { event: Event }) => {
  const isLoading = useSubscribe('players.basic');
  const players = useFind(
    () => Players.find({}, { sort: { money: -1 }, limit: 12 }),
    [],
  );

  useGSAP(() => {
    const circles = gsap.utils.toArray('.leaderboard-player-circle');
    gsap.fromTo(
      circles,
      { rotation: -15 },
      {
        rotation: 15,
        duration: 0.78,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      },
    );
    gsap.timeline({ repeat: -1, repeatDelay: 5 }).fromTo(
      circles,
      {
        rotateY: 720,
        transformPerspective: 1000,
      },
      {
        rotateY: 0,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        duration: 0.8,
      },
    );
  }, [players]);

  if (isLoading()) return null;

  /* FUTURE NOTE: I used some pixels to speed up, will need to not in future */
  return (
    <div
      className={`leaderboard-derby`}
      style={{
        backgroundColor: COLOR_DERBY_BEIGE,
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        position: 'absolute',
        padding: '2vh 5vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '2vh',
      }}
    >
      <div
        style={{
          fontSize: '20vw',
          textAlign: 'center',
          fontFamily: FONT_FAMILY_BRIOSO,
          color: COLOR_DERBY_OFF_WHITE,
          textShadow: `1px 2px 1px rgba(0, 0, 0, 0.5)`,
        }}
      >
        Big Betters
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: FONT_FAMILY_EUROSTILE,
          fontSize: '1.8rem',
        }}
      >
        <div>
          {players.map((player, i) => (
            <div
              key={player._id}
              className="leaderboard-row"
              style={{
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '10px',
                textShadow: `none`,
              }}
            >
              <div className="leaderboard-player-circle">
                <DerbyPlayerCircle
                  player={player}
                  zoom={1}
                  width={50}
                  height={50}
                  style={{
                    border: `3px solid ${COLOR_DERBY_OFF_WHITE}`,
                    filter: `drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5))`,
                  }}
                />
              </div>
              <p
                className="leaderboard-item"
                style={{ color: COLOR_DERBY_BURGUNDY, fontSize: '1.2rem' }}
              >
                {player.alias}
              </p>
              <p
                className="leaderboard-value"
                style={{ color: COLOR_DERBY_BURGUNDY }}
              >
                {commaNumber(player.money)} DD
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DerbyLeaderboard;
