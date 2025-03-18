import React, { useState, useEffect } from 'react';
import { getImageUrl } from '/imports/services/cloudinary/cloudinary-geturl';
import SlotMachineSounds from './SlotMachineSounds';
import { SlotMachineWithHelpers } from '/imports/api/themes/casino/slotMachines/slotMachines';
import './slot-machine.css';
import './leds.css';
import classNames from 'classnames';
import Reel from './Reel';
import SlotMachinePlayer from './SlotMachinePlayer';
import { useConfetti } from '../../hooks/use-confetti';
import SlotMachinePayouts from './SlotMachinePayouts';

interface SlotMachineProps {
  slotMachine: SlotMachineWithHelpers;
  skin: string;
}

export type SlotItem = {
  id: string;
  url: string;
};

const HACKER_WIN_VIDEOS: Record<string, string[]> = {
  normal: [
    '/casino/videos/hackerwin-1.mp4',
    '/casino/videos/hackerwin-2.mp4',
    '/casino/videos/hackerwin-3.mp4',
  ],
  space: [
    '/casino/space/videos/liz-finale-1.mp4',
    '/casino/space/videos/liz-finale-2.mp4',
    '/casino/space/videos/shady-finale-1.mp4',
    '/casino/space/videos/shady-finale-2.mp4',
  ],
};

const getHackerWinVideo = (skin: string) => {
  const videos = HACKER_WIN_VIDEOS[skin];
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
          <div key={v} className={classNames('led', getLedClass(v))}></div>
        ))}
    </div>
  );
};

const SlotMachine = ({ slotMachine, skin }: SlotMachineProps) => {
  const { name, short, cost, status, code, result, win_amount, player, stats } =
    slotMachine;

  const showWin =
    status === 'win-normal' ||
    status === 'win-hacker-partial' ||
    status === 'win-hacker-final';

  useConfetti(showWin);

  const slotClasses = classNames('slot-machine', {
    spinning: status === 'spinning',
    lose: status === 'lose',
    'win-normal': status === 'win-normal',
    'win-hacker-partial': status === 'win-hacker-partial',
    'win-hacker-final': status === 'win-hacker-final',
    win: showWin,
  });

  const titleClasses = classNames(
    'title-name',
    name.length > 8 ? 'compressed' : name.length > 6 ? 'condensed' : '',
  );

  const items =
    skin === 'space'
      ? [
          { id: '💣', url: `/images/emojis/${skin}/fv.svg` },
          { id: '🥴', url: `/images/emojis/${skin}/planet.svg` },
          { id: '🍒', url: `/images/emojis/${skin}/satellite.svg` },
          { id: '🍆', url: `/images/emojis/${skin}/rocket.svg` },
          { id: '🍑', url: `/images/emojis/${skin}/alien.svg` },
          { id: '💦', url: `/images/emojis/${skin}/saucer.svg` },
        ]
      : [
          { id: '🥴', url: `/images/emojis/${skin}/emoji-swoozy.svg` },
          { id: '🍒', url: `/images/emojis/${skin}/emoji-cherry.svg` },
          { id: '💣', url: `/images/emojis/${skin}/emoji-bomb.svg` },
          { id: '🍆', url: `/images/emojis/${skin}/emoji-eggplant.svg` },
          { id: '🍑', url: `/images/emojis/${skin}/emoji-peach.svg` },
          { id: '💦', url: `/images/emojis/${skin}/emoji-splash.svg` },
        ];

  return (
    <>
      <div
        className={classNames('slot-machine', skin)}
        style={{
          backgroundImage: `url(\/images/slot-machine/${skin}/${code}.jpg)`,
        }}
      >
        <div className="title-container">
          <div className={titleClasses}>{name}</div>

          <div className="instrux-area">
            <div className="title-tospin">TO SPIN:</div>
            <div className="title-short">!{short}</div>
          </div>

          <div className="title-price">
            Price:{' '}
            <span className="title-price-bb">
              {cost} {skin === 'space' ? 'VC' : 'BB'}
            </span>
          </div>
        </div>
        <div className="reels-container flex">
          <Leds />
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
          <Leds />
        </div>

        <div className="slot-bottom">
          {player ? (
            <SlotMachinePlayer
              player={player}
              status={status}
              win_amount={showWin ? win_amount! : 0}
              skin={skin}
            />
          ) : (
            <SlotMachinePayouts
              slotMachine={slotMachine}
              items={items}
              skin={skin}
            />
          )}
        </div>
      </div>

      {status === 'win-hacker-final' && (
        <div className="slot-overlay-video">
          <video src={getHackerWinVideo(skin)} autoPlay muted />
        </div>
      )}

      <SlotMachineSounds slotMachine={slotMachine} />
    </>
  );
};

export default SlotMachine;
