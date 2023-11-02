import { Meteor } from 'meteor/meteor';
import { onReceive, send } from '/imports/services/twilio';

import InTexts from '/imports/api/inTexts';
// import OutTexts from 'api/in-texts';

onReceive((message) => {
  Meteor.call('inTexts.receive', message);
});

// OutTexts.observe()
