import React from 'react';
import './RouletteWheel.css';
import { RouletteStatus } from '/imports/schemas/roulette';
import classnames from 'classnames';

interface RouletteWheelProps {
  result: number;
  spin_seconds: number;
  status: RouletteStatus;
}

const angleOffset = 0;

const RouletteWheel = ({
  result,
  spin_seconds,
  status,
}: RouletteWheelProps) => {
  const nums: number[] = [
    32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
    16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0,
  ];

  const ballIsPresent =
    status === 'spinning' ||
    status === 'end-spin' ||
    status === 'winners-board';

  const ballDoneSpinning = status === 'end-spin' || status === 'winners-board';

  const innerClassNames = classnames('inner', {
    rest: ballDoneSpinning,
  });

  return (
    <div className="rouletteWheel">
      <div className="plate" id="plate">
        <ul
          className={innerClassNames}
          data-spinto={ballIsPresent ? result : undefined}
        >
          {nums.map((val, index) => (
            <li className="number" key={index}>
              <label>
                <input
                  type="radio"
                  name="pit"
                  value="32"
                  checked={ballIsPresent && val === result}
                />
                <span className="pit">{val}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="data">
          <div className="data-inner">
            <div className="mask"></div>
            <div className="result">
              <div className="result-number">00</div>
              <div className="result-color">red</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouletteWheel;
