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
  COLOR_DERBY_GREEN,
  COLOR_DERBY_ORANGE,
} from '../DerbyStyleVars';
import { FONT_FAMILY_BRIOSO, FONT_FAMILY_EUROSTILE } from '../DerbyStyleVars';
const DerbyLeaderboard = ({ event }: { event: Event }) => {
  const isLoading = useSubscribe('players.basic');
  const players = useFind(
    () => Players.find({}, { sort: { money: -1 }, limit: 12 }),
    [],
  );

  if (isLoading()) return null;

  return (
    <div
      className={`leaderboard-derby`}
      style={{
        background: `url(/derby/textures/toteboard.jpg) ${COLOR_DERBY_GREEN} no-repeat center center`,
        backgroundSize: 'cover',
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
          textShadow: `0 4px 4px rgba(0, 0, 0, 0.5)`,
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
              }}
            >
              <div>
                <DerbyPlayerCircle
                  player={player}
                  zoom={1}
                  width={50}
                  height={50}
                  style={{
                    border: `4px solid ${COLOR_DERBY_ORANGE}`,
                  }}
                />
              </div>
              <p
                className="leaderboard-item"
                style={{ color: COLOR_DERBY_OFF_WHITE }}
              >
                {player.alias}
              </p>
              <p
                className="leaderboard-value"
                style={{ color: COLOR_DERBY_OFF_WHITE }}
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
