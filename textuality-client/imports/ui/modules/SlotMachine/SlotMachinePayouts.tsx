import React, { useEffect, useState } from 'react';
import { SlotMachine } from '/imports/schemas/slotMachine';
import { SlotItem } from './SlotMachine';
import './SlotMachinePayouts.css';

const SlotMachinePayouts = ({
  slotMachine,
  items,
}: {
  slotMachine: Partial<SlotMachine>;
  items: SlotItem[];
}) => {
  const { odds } = slotMachine;

  const [payoutIndex, setPayoutIndex] = useState(
    Math.floor(Math.random() * items.length),
  );
  const [active, setActive] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!Array.isArray(odds)) return;
      setActive(false);
      setTimeout(() => {
        setPayoutIndex((payoutIndex + 1) % odds.length);
        setActive(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [payoutIndex, odds?.length ?? '-1']);

  if (!odds) return;

  const currentPayout = odds[payoutIndex];
  if (!currentPayout) return null;

  return (
    <div className="slot-payout" style={{ opacity: active ? 1 : 0 }}>
      <div className="slot-payout-emojis">
        {currentPayout.result.map((emoji, i) => {
          const item = items.find(({ id }) => id === emoji);
          return <img key={i} src={item?.url} alt="Slot Machine Item" />;
        })}
      </div>
      <div className="slot-payout-value">
        x{currentPayout.payout_multiplier}
      </div>
    </div>
  );
};

export default SlotMachinePayouts;
