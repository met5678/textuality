import React from 'react';
import './RouletteGrid.css';

const RouletteGrid = ({}) => {
  const getNumbers = (start: number) => {
    return Array.from({ length: 12 }, (_, index) => index * 3 + start);
  };
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  const isRed = (num: number) => redNumbers.includes(num);

  return (
    <div className="rouletteGrid">
      <table>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(3).map((number, index) => (
            <td
              key={index}
              className={isRed(number) ? 'red' : 'black'}
              id={`${number}`}
            >
              {number}
            </td>
          ))}
        </tr>
        <tr className="nums">
          <td className="green zero" id="0">
            <span>0</span>
          </td>
          {getNumbers(2).map((number, index) => (
            <td
              key={index}
              className={isRed(number) ? 'red' : 'black'}
              id={`${number}`}
            >
              {number}
            </td>
          ))}
        </tr>
        <tr className="nums">
          <td className="green zero" />
          {getNumbers(1).map((number, index) => (
            <td
              key={index}
              className={isRed(number) ? 'red' : 'black'}
              id={`${number}`}
            >
              {number}
            </td>
          ))}
        </tr>
        <tr>
          <td className="empty"></td>
          <td colSpan={3} className="even" id="even">
            Even
          </td>
          <td colSpan={3} className="red" id="red">
            Red
          </td>
          <td colSpan={3} className="black" id="black">
            Black
          </td>
          <td colSpan={3} className="odd" id="odd">
            Odd
          </td>
        </tr>
      </table>
    </div>
  );
};

export default RouletteGrid;
