import React, { useState, useEffect } from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import SlotMachineSounds from './SlotMachineSounds';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';
import './slot-machine.css';
import Reel from './Reel';
import RouletteChip from '../Roulette/RouletteChip';
import { PlayerShort } from '/imports/schemas/rouletteBet';

export type SlotItem = {
  id: string;
  url: string;
};

const SlotMachinePlayer = ({ player }: { player: PlayerShort }) => {
  return (
    <div className="slot-player">
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
