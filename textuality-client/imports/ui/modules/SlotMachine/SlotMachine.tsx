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

const SlotMachine = ({ slotMachine }: SlotMachineProps) => {
  const { name, short, cost, status, code, result, win_amount, player, stats } =
    slotMachine;

  const itemHeight = 20;
  // const [state, setState] = useState(SlotMachineState.IDLE);
  const [index, setIndex] = useState(0);
  // const [isStopping, setStopping] = useState(false);
  // const [targetItem, setTargetItem] = useState('');

  const timePerIcon = 100;

  useEffect(() => {
    if (status === 'spinning') {
    } else {
      console.log();
    }
  }, [status]);

  const [items, setItems] = useState([
    { id: '🥴', url: '/images/emojis/emoji-swoozy.svg' },
    { id: '🍒', url: '/images/emojis/emoji-cherry.svg' },
    { id: '💣', url: '/images/emojis/emoji-bomb.svg' },
    { id: '🍆', url: '/images/emojis/emoji-eggplant.svg' },
    { id: '🍑', url: '/images/emojis/emoji-peach.svg' },
    { id: '💦', url: '/images/emojis/emoji-splash.svg' },
  ]);

  const [isSpinning, setSpinning] = useState(false);

  const startSpin = () => {
    setSpinning(true);
  };

  const stopReelAtIndex = (targetItem: string) => {
    // setTargetItem(targetItem);
    // setStopping(true);
  };

  const avatarUrl = player
    ? getImageUrl(player?.avatar_id, { width: 80, height: 80 })
    : '';

  return (
    <>
      {/* <dt>Short</dt>
        <dd>!{short}</dd>

        <dt>Status</dt>
        <dd>{status}</dd> */}
      <div
        className="slot-machine"
        style={{ backgroundImage: `url(\/images/slot-machine/${code}.jpg)` }}
      >
        <div className="stats">
          <div className="flex">
            <div>
              <p className="subtitle">Slot Machine: </p>
              <p className="title">{name}</p>

              <div className="flex">
                <p className="subtitle">Price: </p>
                <p className="subtitle">{cost}</p>
              </div>

              <div className="flex">
                <p className="subtitle">Status: </p>
                <p className="subtitle">{status}</p>
              </div>
            </div>
          </div>

          {/* TODO: Dynamically show without jumping */}
          {
            <>
              <div className="flex">
                <img src={avatarUrl} className="avatar" alt="Avatar" />
                <div>
                  <div>
                    <p className="body-small">Player:</p>
                    <p className="body">{player?.alias}</p>
                  </div>
                  <div className="flex wallet">
                    <p className="body-small">Wallet:</p>
                    <p className="body-small">{player?.money}</p>
                  </div>
                </div>
              </div>
            </>
          }
        </div>
        <div className="reels">
          <Reel
            key={index}
            items={items}
            isSpinning={isSpinning}
            targetItem={''}
            setIsStopping={() => {}}
            isStopping={false}
          />
          <Reel
            key={index}
            items={items}
            isSpinning={isSpinning}
            targetItem={''}
            setIsStopping={() => {}}
            isStopping={false}
          />
          <Reel
            key={index}
            items={items}
            isSpinning={isSpinning}
            targetItem={''}
            setIsStopping={() => {}}
            isStopping={false}
          />
        </div>
      </div>
      {/* <div className="slot-machine">
        <div className="roller-container">
          <div className="roller" style={rollerStyles} ref={reelRef}>
            {urls.map((url, i) => (
              <img key={url} src={url} alt="" style={rollItemStyles} />
            ))}
          </div>
        </div> */}
      {/* {rollers.map((roller, i) => (
        <div className="rollers">
          {roller.map((roller-item, j) => (
            <div className="roller roll-animation">{item}</div>
          ))}
        </div>
      ))} */}
      {/* <div className="slot-machine">
        <p>{name}</p>
        <p>{cost}</p>
        <p>{status}</p>
        <p>Result</p>
        <p>{result?.join(' - ')}</p>

        <p>Win Amount</p>
        <p>{win_amount}</p>

        <p>Player</p>
        <p>{player?.alias}</p>
        <p>{player?.avatar_id}</p>
        <p>{player?.money}</p>

        <dt>Result</dt>
        <dd>{result?.join(' - ')}</dd>

        <dt>Win Amount</dt>
        <dd>{win_amount}</dd>

        <dt>Player</dt>
        <dd>{player?.alias}</dd>
        <dd>{player?.avatar_id}</dd>
        <dd>{player?.money}</dd>
        {player?.avatar_id && (
          <img
            src={getImageUrl(player?.avatar_id, {
              width: 100,
              height: 100,
              zoom: 1.2,
            })}
            alt="avatar"
          />
        )}

        <dt>Stats</dt>
        <dd>{stats.spin_count}</dd>
        <dd>{stats.profit}</dd>
      </dl>
      <SlotMachineSounds slotMachine={slotMachine} />
        <p>Player Queue</p>
        <p>{player_queue.length}</p>
      </div> */}
    </>
  );
};

export default SlotMachine;
