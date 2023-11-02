import { Meteor } from 'meteor/meteor';
import {
  OutgoingMessageData,
  onReceive,
} from '/imports/services/whatsapp/index';
import { IncomingMessageData } from '/imports/services/whatsapp/wa-handlemessage';
import { sendMessage } from '/imports/services/whatsapp/index';
import OutTexts from '/imports/api/outTexts';

Meteor.startup(() => {
  onReceive((message: IncomingMessageData) => {
    Meteor.call('inTexts.receive', message);
  });

  OutTexts.find({ status: 'unsent' }).observe({
    added(outText) {
      const outMessage: OutgoingMessageData = {
        from: outText.from_number,
        to: outText.to_number,
        text: outText.body,
        mediaUrl: outText.media_url,
      };

      sendMessage(outMessage).then(() => {
        Meteor.call('outTexts.setStatus', outText._id, 'sent');
      });
    },
  });
});
