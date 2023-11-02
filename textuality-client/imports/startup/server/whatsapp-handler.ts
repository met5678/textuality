import { onReceive, send } from '/imports/services/whatsapp';

import { Meteor } from 'meteor/meteor';

import InTexts from '/imports/api/inTexts';
// import OutTexts from 'api/in-texts';

Meteor.startup(() => {
  onReceive((message) => {
    console.log('Received in handler', message);
    Meteor.call('inTexts.receive', message);
  });
});

// OutTexts.observe()
