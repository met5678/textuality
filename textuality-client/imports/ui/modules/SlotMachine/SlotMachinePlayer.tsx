import React from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import './SlotMachinePlayer.css';
import { PlayerShort } from '/imports/schemas/rouletteBet';
import { SlotMachineStatus } from '/imports/schemas/slotMachine';

const SlotMachinePlayer = ({
  player,
  status,
}: {
  player: PlayerShort;
  status: SlotMachineStatus;
}) => {
  return (
    <div className={`slot-player ${status ?? ''}`}>
      <div
        className="player-avatar-chip"
        style={{
          backgroundImage: `url(${getImageUrl(player.avatar_id, {
            width: 100,
            height: 100,
          })})`,
        }}
      ></div>
      <div className="player-alias">{player.alias}</div>
      <div className="player-money">{player.money} BB</div>
    </div>
  );
};

export default SlotMachinePlayer;
