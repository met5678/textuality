import React from 'react';

const BottomBar = () => {
  return (
    <div className="bottomBar">
      <div className="bottomBar-item">
        <span className="bottomBar-command">/suspect scarlet</span>
        <span className="bottomBar-info">Guess suspect</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/room hall</span>
        <span className="bottomBar-info">Guess room</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/weapon dagger</span>
        <span className="bottomBar-info">Guess weapon</span>
      </div>
      <div className="bottomBar-item">
        <span className="bottomBar-command">/casefile</span>
        <span className="bottomBar-info">Review Casefile</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/leave</span>
        <span className="bottomBar-info">Leave Game</span>
      </div>
    </div>
  );
};

export default BottomBar;
