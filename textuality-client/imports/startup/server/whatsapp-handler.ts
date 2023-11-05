import { Meteor } from 'meteor/meteor';
import {
  OutgoingMessageData,
  onMessageStatus,
  onReceive,
} from '/imports/services/whatsapp/index';
import { IncomingMessageData } from '/imports/services/whatsapp/wa-handlemessage';
import { sendMessage } from '/imports/services/whatsapp/index';
import OutTexts from '/imports/api/outTexts';

Meteor.startup(() => {
  onReceive((message: IncomingMessageData) => {
    Meteor.call('inTexts.receive', message);
  });

  onMessageStatus((statusData) => {
    Meteor.call(
      'outTexts.updateStatusByExternalId',
      statusData.message_id,
      statusData.status,
    );
  });

  // This is to prevent messages from being sent a second time if there
  // was an error when sending them.
  OutTexts.update(
    { status: 'unsent' },
    { $set: { status: 'nosend' } },
    { multi: true },
  );

  OutTexts.find({ status: 'unsent' }).observe({
    added(outText) {
      const outMessage: OutgoingMessageData = {
        to: outText.player_number,
        text: outText.body,
        mediaUrl: outText.media_url,
      };

      if (Meteor.isProduction) {
        sendMessage(outMessage).then((external_id) => {
          Meteor.call('outTexts.setExternalId', outText._id, external_id);
          Meteor.call('outTexts.updateStatus', outText._id, 'sent');
        });
      } else {
        console.log('Is dev, not sending message');
      }
    },
  });
});
