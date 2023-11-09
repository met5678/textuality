import React, { useEffect, useState } from 'react';
import './reel.css';
import { SlotItem } from './SlotMachine';
import classNames from 'classnames';
import { SlotMachineStatus } from '/imports/schemas/slotMachine';

type ReelProps = {
  items: SlotItem[];
  status: SlotMachineStatus;
  targetItem: string | undefined;
  index: number;
};

export default function Reel({ items, status, targetItem, index }: ReelProps) {
  const reelClasses = classNames('reel', {
    'is-spinning': status === 'spinning',
  });

  const reelContainerClasses = classNames('reel-container', {
    'is-win-normal': status === 'win-normal',
  });

  const itemsWithWraparound = [...items, items[0]];
  const targetIndex = items.findIndex((item) => item.id === targetItem);

  const reelStyle: Record<string, string> = {
    width: `${itemsWithWraparound.length * 100}%`,
    animationDelay: index * 50 + 'ms',
  };

  if (status !== 'spinning') {
    reelStyle.transform = `translateX(-${
      (targetIndex / itemsWithWraparound.length) * 100
    }%)`;
  }

  return (
    <div className={reelContainerClasses}>
      <div className={reelClasses} style={reelStyle}>
        {itemsWithWraparound.map((item, idx) => (
          <img key={idx} src={item.url} alt="Slot Machine Item" />
        ))}
      </div>
    </div>
  );
}
