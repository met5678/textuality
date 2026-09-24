import React from 'react';
import './FlashyText.css';

const FlashyText = ({ text }: { text: string }) => {
  return text.split('').map((letter, index) => (
    <span className="flasyText">
      <span
        key={index}
        className={index % 2 === 0 ? 'flashyEvenLetter' : 'flashyOddLetter'}
      >
        {letter}
      </span>
    </span>
  ));
};

export default FlashyText;
