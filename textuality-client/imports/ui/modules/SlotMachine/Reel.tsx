import React, { useEffect, useState } from 'react';
import './reel.css';
import { SlotItem } from './SlotMachine';

type ReelProps = {
  items: SlotItem[];
  isSpinning: boolean;
  targetItem: string;
  isStopping: boolean;
  setIsStopping: (isStopping: boolean) => void;
};

export default function Reel({
  items,
  isSpinning,
  targetItem,
  isStopping,
  setIsStopping,
}: ReelProps) {
  useEffect(() => {
    if (isSpinning) {
      const reelElement = document.querySelector('.reel');
      if (reelElement) {
        reelElement.classList.add('spinning');
      }
    } else {
      // When spinning stops, check if we need to stop at the target item
      if (isStopping) {
        // If the current option matches the target item and we're in stopping mode, remove the spinning class
        const reelElement = document.querySelector('.reel');
        if (reelElement) {
          reelElement.classList.remove('spinning');
          setIsStopping(false);
        }
      }
    }
  }, [isSpinning, targetItem, isStopping]);

  useEffect(() => {}, []);

  return (
    <div className="container">
      {/* <div className="reel" style={reelStyles}>
        {options.map((option, index) => (
          <img key={index} src={option} alt="Slot Machine Item" />
        ))}
      </div> */}
      {/* <div className="second-reel">
        {options.map((option, index) => (
          <img key={index} src={option} alt="Slot Machine Item" />
        ))}
      </div> */}
    </div>
  );
}
