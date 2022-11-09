import React, { useState } from 'react';

const Tips = ({ event, round } = {}) => {
  const [tipIndex, setTipIndex] = useState(0);

  const changeTip = React.useCallback(() =>
    setTipIndex((tipIndex + 1) % TipsComponents.length)
  );

  React.useEffect(() => {
    const interval = setInterval(changeTip, 15000);
    return () => clearInterval(interval);
  });

  const TipComponent = TipsComponents[tipIndex];

  return (
    <div className="tips">
      <TipComponent />
    </div>
  );
};

const TipsComponents = [
  () => (
    <div className="tips-container">
      <div className="tip-item">
        Find <span className="tip-item-red">evidence hashtags</span> around the
        house.
      </div>
      <div className="tip-item">
        Text them in to receive <span className="tip-item-red">clues</span>.
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        All <span className="tip-item-red">#evidence</span> is visible in
        plain(-ish) sight.
      </div>
      <div className="tip-item">
        Do <span className="tip-item-red">NOT</span> open drawers, doors, or
        cabinets.
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        Seek out the <span className="tip-item-red">special agents</span> at the
        soiree...
      </div>
      <div className="tip-item">...they have valuable evidence for you!</div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        Make an accusation by texting the command{' '}
        <span className="tip-item-red">/suspect</span> ___
      </div>
      <div className="tip-item">
        followed by the name of the suspect you wish to accuse!
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        Guess where the murder took place by texting the command{' '}
        <span className="tip-item-red">/room</span> ___
      </div>
      <div className="tip-item">
        followed by your vote for scene of the crime!
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        Take a stab at guessing the murder weapon by texting{' '}
        <span className="tip-item-red">/weapon</span> ____
      </div>
      <div className="tip-item">
        followed by the name of the weapon you think was used in the murder!
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        You can modify your guesses and accusations as many times as you like.
      </div>
      <div className="tip-item">
        It's a sign of maturity to learn from your mistakes and try new things!
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        You can text <span className="tip-item-red">/casefile</span> at any time
      </div>
      <div className="tip-item">to review your evidence and clues.</div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        <span className="tip-item-red">Secret agents</span> may approach you for
        interviews.
      </div>
      <div className="tip-item">
        Listen to them closely to gather secret evidence!
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        There is <span className="tip-item-red">NO</span> #evidence hidden in
        the bathrooms.
      </div>
      <div className="tip-item">Please do not search or linger therein.</div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        The mystery will be revealead at{' '}
        <span className="tip-item-red">midnight</span>.
      </div>
      <div className="tip-item">
        You will have until then to make your accusations!
      </div>
    </div>
  ),
  () => (
    <div className="tips-container">
      <div className="tip-item">
        Find the secret agents wearing the{' '}
        <span className="yellow">glowing candles</span>.
      </div>
      <div className="tip-item">What else would they wear?</div>
    </div>
  ),
];

export default Tips;
