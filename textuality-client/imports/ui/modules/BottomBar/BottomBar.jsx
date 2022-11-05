import React from 'react';

const BottomBar = () => {
  const [barIndex, setBarIndex] = React.useState(0);

  const changeTip = React.useCallback(() =>
    setBarIndex((barIndex + 1) % BarComponents.length)
  );

  React.useEffect(() => {
    const interval = setInterval(changeTip, 15000);
    return () => clearInterval(interval);
  });

  const CurrentBar = BarComponents[barIndex];

  return (
    <div className="bottomBar">
      <CurrentBar />
    </div>
  );
};

const BarComponents = [
  () => (
    <>
      <div className="bottomBar-item">
        <span className="bottomBar-command">/suspect ____</span>
        <span className="bottomBar-info">Guess suspect</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/room ____</span>
        <span className="bottomBar-info">Guess room</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/weapon ____</span>
        <span className="bottomBar-info">Guess weapon</span>
      </div>
    </>
  ),
  () => (
    <>
      <div className="bottomBar-item">
        <span className="bottomBar-command">/casefile</span>
        <span className="bottomBar-info">Review Casefile</span>
      </div>
      <div className="bottomBar-item">
        <span className="bottomBar-command">/leave</span>
        <span className="bottomBar-info">Leave Game</span>
      </div>
    </>
  ),
];

export default BottomBar;
