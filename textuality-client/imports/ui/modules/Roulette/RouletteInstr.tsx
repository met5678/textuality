import React, { useState, useEffect } from 'react';

const RouletteInstr = ({}) => {
  const [instrIndex, setInstrIndex] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false);
      setTimeout(() => {
        setInstrIndex((instrIndex + 1) % Instructions.length);
        setActive(true);
      }, 500); // Delay for 500ms before fading in the new instruction
    }, 15000);

    return () => clearInterval(interval);
  }, [instrIndex]);

  const Instruction = Instructions[instrIndex];

  return (
    <p className={`fade-in-out ${active ? 'active' : ''}`}>
      <Instruction />
    </p>
  );
};

const Instructions = [
  () => (
    <>
      Send <code>![BET] [WAGER]</code> to place your bet
    </>
  ),
  () => (
    <>
      Example: <code>!odd 50</code> places <b>50BB</b> on <b>ODD</b>
    </>
  ),
  () => (
    <>
      Send <code>![BET] [WAGER]</code> to place your bet
    </>
  ),
  () => (
    <>
      Example: <code>!21 100</code> places <b>100BB</b> on <b>21</b>
    </>
  ),
];

export default RouletteInstr;
