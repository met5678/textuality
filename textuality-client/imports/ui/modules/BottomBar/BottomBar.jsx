import React from 'react';

const BottomBar = () => {
  return (
    <div className="bottomBar">
      <div className="bottomBar-item">
        <span className="bottomBar-command">/status</span>
        <span className="bottomBar-info">See Your Status</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/alias</span>
        <span className="bottomBar-info">Change Alias</span>
      </div>

      <div className="bottomBar-item">
        <span className="bottomBar-command">/leave</span>
        <span className="bottomBar-info">Leave Game</span>
      </div>
    </div>
  );
};

export default BottomBar;
