import React from 'react';
import phoneNumberToString from 'utils/phone-number-to-string';

const Header = ({ event }) => {
  return (
    <header>
      {/*<h1>{event.name}</h1>*/}
      <h1 className="name-name">
        C<span className="clue-l">l</span>ue
      </h1>
      <h1 className="phone-number">{phoneNumberToString(event.phoneNumber)}</h1>
    </header>
  );
};

export default Header;
