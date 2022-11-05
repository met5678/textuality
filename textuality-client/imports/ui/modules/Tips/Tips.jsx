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
        You can modify your guess as many times as you like.
      </div>
      <div className="tip-item">
        It's a sign of maturity to learn from your mistakes and try new things!
      </div>
    </div>
  ),
];

export default Tips;
