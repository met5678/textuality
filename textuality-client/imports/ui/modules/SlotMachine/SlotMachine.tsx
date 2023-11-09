import React, { useState, useEffect } from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import SlotMachineSounds from './SlotMachineSounds';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';
import './slot-machine.css';
import Reel from './Reel';

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
  const [state, setState] = useState(SlotMachineState.IDLE);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log(status);

    if (status === 'spinning') {
      setState(SlotMachineState.SPINNING);
    } else {
      console.log();
      setState(SlotMachineState.IDLE);
    }
  }, [status]);

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
        <div className="info">
          <div>
            <p className="subtitle text-center">{name}</p>

            <div className="text-center" style={{ marginTop: '10px' }}>
              <p className="subtitle">TO SPIN,</p>
              <p className="title">💬 !{short}</p>
            </div>

            <p className="subtitle text-center" style={{ marginTop: '8px' }}>
              Price: {cost}
            </p>
          </div>
        </div>
        <div className="reels">
          <Reel
            items={items}
            isSpinning={status === 'spinning'}
            targetItem={result?.[0]}
            setIsStopping={() => {}}
            isStopping={false}
          />
          <Reel
            key="2"
            items={items}
            isSpinning={state === SlotMachineState.SPINNING}
            targetItem={result?.[1]}
            setIsStopping={() => {}}
            isStopping={false}
          />
          <Reel
            key="3"
            items={items}
            isSpinning={state === SlotMachineState.SPINNING}
            targetItem={result?.[2]}
            setIsStopping={() => {}}
            isStopping={false}
          />
        </div>

        {/* TODO: Dynamically show without jumping */}
        {
          <>
            <div className="flex">
              <img src={avatarUrl} className="avatar" alt="Avatar" />
              <div>
                <div>
                  <p className="body">Player:</p>
                  <p className="body">{player?.alias}</p>
                </div>
                <div className="flex wallet">
                  <p className="body">Wallet:</p>
                  <p className="body">{player?.money}</p>
                </div>
              </div>
            </div>
          </>
        }
      </div>

      <SlotMachineSounds slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachine;
