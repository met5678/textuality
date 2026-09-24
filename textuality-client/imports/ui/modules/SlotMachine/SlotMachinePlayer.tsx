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
  hacked,
}: {
  player: PlayerShort;
  status: SlotMachineStatus;
  win_amount: number;
  skin: string;
  hacked: boolean;
}) => {
  return (
    <div className={`slot-player ${status ?? ''} ${skin}`}>
      <div className="player-avatar-chip-wrapper">
        <div
          className="player-avatar-chip"
          style={{
            backgroundImage: !hacked
              ? `url(${getImageUrl(player.avatar_id, {
                  width: 100,
                  height: 100,
                })})`
              : "url('/casino/hacker/glitch-icon.png')",
          }}
        />
      </div>
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
