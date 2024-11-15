import React from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import './SlotMachinePlayer.css';
import { SlotMachineStatus } from '/imports/schemas/slotMachine';
import { PlayerShort } from '/imports/schemas/player';
import commaNumber from 'comma-number';

const SlotMachinePlayer = ({
  player,
  status,
  win_amount,
  skin,
}: {
  player: PlayerShort;
  status: SlotMachineStatus;
  win_amount: number;
  skin: string;
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
      <div className="player-money">
        {win_amount
          ? `+ ${commaNumber(win_amount)} ${skin === 'space' ? 'VC' : 'BB'}`
          : ``}
      </div>
    </div>
  );
};

export default SlotMachinePlayer;
