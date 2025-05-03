import React from 'react';
import { PlayerWithHelpers } from '/imports/api/players/players';
import {
  COLOR_DERBY_BURGUNDY,
  COLOR_DERBY_ORANGE,
} from '../../../DerbyStyleVars';

interface DerbyPlayerCircleProps {
  player: PlayerWithHelpers;
  zoom?: number;
  width?: number;
  height?: number;
}

const DerbyPlayerCircle: React.FC<DerbyPlayerCircleProps> = ({
  player,
  zoom = 1,
  width = 250,
  height = 250,
}) => {
  return (
    <div
      className="derby-player-circle"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${player.getAvatarUrl(width, zoom)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        border: `1vw solid ${COLOR_DERBY_ORANGE}`,
      }}
    />
  );
};

export default DerbyPlayerCircle;
