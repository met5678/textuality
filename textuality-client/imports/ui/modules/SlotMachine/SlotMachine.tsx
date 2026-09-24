import React from 'react';
import SlotMachineSounds from './SlotMachineSounds';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';
import './slot-machine.css';
import './leds.css';
import classnames from 'classnames';
import Reel from './Reel';
import SlotMachinePlayer from './SlotMachinePlayer';
import { useConfetti } from '../../hooks/use-confetti';
import SlotMachinePayouts from './SlotMachinePayouts';
import { themes, Theme } from '../../themes/casino/CasinoThemeConfig';

interface SlotMachineProps {
  slotMachine: SlotMachineWithHelpers;
  skin: string;
}

export type SlotItem = {
  id: string;
  url: string;
};

const getHackerWinVideo = (videos: string[]) => {
  if (!videos) {
    return '';
  }
  return videos[Math.floor(Math.random() * videos.length)];
};

const Leds = () => {
  const getLedClass = (index: number) => {
    if (index % 4 === 0) {
      return 'led-green';
    } else if (index % 4 === 1) {
      return 'led-yellow';
    } else if (index % 4 === 2) {
      return 'led-red';
    } else if (index % 4 === 3) {
      return 'led-magenta';
    }
  };

  return (
    <div className="led-container">
      {[...Array(8).keys()]
        .map((i) => i + 1)
        .map((v) => (
          <div key={v} className={classnames('led', getLedClass(v))}></div>
        ))}
    </div>
  );
};

const SlotMachine = ({ slotMachine, skin }: SlotMachineProps) => {
  const { name, short, cost, status, result, win_amount, player } = slotMachine;

  const theme = themes[skin as Theme];
  const { currency, slotEmojis, slotHackerVids } = theme;

  const showWin =
    status === 'win-normal' ||
    status === 'win-hacker-partial' ||
    status === 'win-hacker-final';

  const compressText = name.length > 12;

  useConfetti(showWin);

  const slotClasses = classnames('slot-machine', {
    spinning: status === 'spinning',
    lose: status === 'lose',
    'win-normal': status === 'win-normal',
    'win-hacker-partial': status === 'win-hacker-partial',
    'win-hacker-final': status === 'win-hacker-final',
    win: showWin,
  });

  return (
    <>
      <div
        className={classnames('slot-machine', skin)}
        style={{
          backgroundImage: `url(\/images/slot-machine/${skin}/${short}.jpg)`,
        }}
      >
        <div className="title-container">
          <div
            className={classnames(
              'title-name',
              compressText ? 'compressed' : '',
            )}
          >
            {name}
          </div>

          <div className="instrux-area">
            <div className="title-tospin">TO SPIN:</div>
            <div
              className={classnames(
                'title-short',
                compressText ? 'compressed' : '',
              )}
            >
              !{short}
            </div>
          </div>

          <div className="title-price">
            Price:{' '}
            <span className="title-price-bb">
              {cost} {currency}
            </span>
          </div>
        </div>
        <div className="reels-container flex">
          <Leds />
          <div className="reels">
            <Reel
              items={slotEmojis}
              status={status}
              targetItem={result?.[0]}
              index={0}
            />
            <Reel
              key="2"
              items={slotEmojis}
              status={status}
              targetItem={result?.[1]}
              index={1}
            />
            <Reel
              key="3"
              items={slotEmojis}
              status={status}
              targetItem={result?.[2]}
              index={2}
            />
          </div>
          <Leds />
        </div>

        <div className="slot-bottom">
          {player ? (
            <SlotMachinePlayer
              player={player}
              status={status}
              win_amount={showWin ? win_amount! : 0}
              skin={skin}
              hacked={status === 'win-hacker-final'}
            />
          ) : (
            <SlotMachinePayouts
              slotMachine={slotMachine}
              items={slotEmojis}
              skin={skin}
            />
          )}
        </div>
      </div>

      {status === 'win-hacker-final' && (
        <div className="slot-overlay-video">
          <video src={getHackerWinVideo(slotHackerVids)} autoPlay loop muted />
        </div>
      )}

      <SlotMachineSounds slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachine;
