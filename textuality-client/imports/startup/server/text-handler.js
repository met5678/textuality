import { onReceive, send } from 'services/twilio.js';

import InTexts from 'api/in-texts';
// import OutTexts from 'api/in-texts';

onReceive(message => {
  Meteor.call('inTexts.receive', message);
});

// OutTexts.observe()
