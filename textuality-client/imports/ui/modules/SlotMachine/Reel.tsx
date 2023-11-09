import React, { useEffect, useState } from 'react';
import './reel.css';
import { SlotItem } from './SlotMachine';

type ReelProps = {
  items: SlotItem[];
  isSpinning: boolean;
  targetItem: string | undefined;
  isStopping: boolean;
  setIsStopping: (isStopping: boolean) => void;
};

export default function Reel({ items, isSpinning, targetItem }: ReelProps) {
  const [t, setT] = useState(0);

  useEffect(() => {
    const slots = document.querySelectorAll('.reel');
    console.log('asdsa', slots);
    slots.forEach((slot) => {
      slot.classList.add('spinning');
    });
  }, []);

  useEffect(() => {
    const targetIndex = items.findIndex((item) => item.id === targetItem);
    setT(targetIndex * 52);
  }, [targetItem]);

  const reelStyles = {
    // transform: `translateY(-${t}vw)`,
    transition: `transform 1s ease-in-out`,
  };

  return (
    <div className="container">
      <div className="reel" style={reelStyles}>
        {items.map((item, index) => (
          <img key={index} src={item.url} alt="Slot Machine Item" />
        ))}
      </div>
    </div>
  );
}
