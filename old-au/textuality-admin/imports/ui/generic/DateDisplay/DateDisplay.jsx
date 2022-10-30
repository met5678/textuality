import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

Moment.globalFormat = 'ddd, M/DD/YY, h:mma';

const DateDisplay = props => <Moment {...props} />;

export default DateDisplay;
