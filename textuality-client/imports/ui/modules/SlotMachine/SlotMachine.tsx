import React, { useState, useEffect } from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import SlotMachineSounds from './SlotMachineSounds';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';
import './slot-machine.css';
import Reel from './Reel';
import RouletteChip from '../Roulette/RouletteChip';

interface SlotMachineProps {
  slotMachine: SlotMachineWithHelpers;
}

export type SlotItem = {
  id: string;
  url: string;
};

enum SlotMachineState {
  IDLE,
  SPINNING,
}

const SlotMachine = ({ slotMachine }: SlotMachineProps) => {
  const { name, short, cost, status, code, result, win_amount, player, stats } =
    slotMachine;

  const items = [
    { id: '🥴', url: '/images/emojis/emoji-swoozy.svg' },
    { id: '🍒', url: '/images/emojis/emoji-cherry.svg' },
    { id: '💣', url: '/images/emojis/emoji-bomb.svg' },
    { id: '🍆', url: '/images/emojis/emoji-eggplant.svg' },
    { id: '🍑', url: '/images/emojis/emoji-peach.svg' },
    { id: '💦', url: '/images/emojis/emoji-splash.svg' },
  ];

  const avatarUrl = player
    ? getImageUrl(player?.avatar_id, { width: 80, height: 80 })
    : '';

  return (
    <>
      <div
        className="slot-machine"
        style={{ backgroundImage: `url(\/images/slot-machine/${code}.jpg)` }}
      >
        <div className="title-container">
          <div className="title-name">{name}</div>

          <div className="instrux-area">
            <div className="title-tospin">TO SPIN:</div>
            <div className="title-short">!{short}</div>
          </div>

          <div className="title-price">
            Price: <span className="title-price-bb">{cost} BB</span>
          </div>
        </div>
        <div className="reels-container">
          <div className="reels">
            <Reel
              items={items}
              status={status}
              targetItem={result?.[0]}
              index={0}
            />
            <Reel
              key="2"
              items={items}
              status={status}
              targetItem={result?.[1]}
              index={1}
            />
            <Reel
              key="3"
              items={items}
              status={status}
              targetItem={result?.[2]}
              index={2}
            />
          </div>
        </div>

        <div className="slot-bottom">
          {player && (
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
          )}
        </div>
      </div>

      <SlotMachineSounds slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachine;
