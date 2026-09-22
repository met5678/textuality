import React, { useState, useEffect } from 'react';

const RouletteInstr = ({ skin }: { skin: string }) => {
  const [instrIndex, setInstrIndex] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false);
      setTimeout(() => {
        setInstrIndex((instrIndex + 1) % Instructions.length);
        setActive(true);
      }, 500); // Delay for 500ms before fading in the new instruction
    }, 8000);

    return () => clearInterval(interval);
  }, [instrIndex]);

  const Instructions = [
    () => (
      <>
        e.g.{' '}
        <strong>
          <i>!odd 50</i>
        </strong>{' '}
        places 50{skin === 'space' ? 'VC' : 'BB'} on ODD
      </>
    ),
    () => (
      <>
        e.g.{' '}
        <strong>
          <i>!21 100</i>
        </strong>{' '}
        places 100{skin === 'space' ? 'VC' : 'BB'} on 21
      </>
    ),
  ];
  const Instruction = Instructions[instrIndex];

  return (
    <p className={`fade-in-out ${active ? 'active' : ''}`}>
      <Instruction />
    </p>
  );
};

export default RouletteInstr;
