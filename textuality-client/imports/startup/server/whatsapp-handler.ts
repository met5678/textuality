import { Meteor } from 'meteor/meteor';
import { onMessageStatus, onReceive } from '/imports/services/whatsapp/index';
import { IncomingMessageData } from '/imports/services/whatsapp/wa-handlemessage';
import { sendMessage } from '/imports/services/whatsapp/index';
import OutTexts from '/imports/api/outTexts';
import { DB_ENV } from './env-vars';
import { OutgoingMessageData } from '/imports/services/whatsapp/wa-types';

let observeHandle: Meteor.LiveQueryHandle | null = null;
let hasStartedUp = false;

const initializeWhatsappHandler = async () => {
  console.log('Initializing WhatsApp handler');
  if (observeHandle) {
    console.log('Deregistering old observer');
    observeHandle.stop();
  }

  onReceive((message: IncomingMessageData) => {
    Meteor.call('inTexts.receive', message);
  });

  // This is mostly to give us read receipts for messages we send.
  onMessageStatus((statusData) => {
    Meteor.callAsync(
      'outTexts.updateStatusByExternalId',
      statusData.message_id,
      statusData.status,
    );
  });

  // This is to prevent messages from being sent a second time if there
  // was an error when sending them.
  await OutTexts.updateAsync(
    { status: 'unsent' },
    { $set: { status: 'nosend' } },
    { multi: true },
  );

  observeHandle = OutTexts.find({ status: 'unsent' }).observe({
    added(outText) {
      const outMessage: OutgoingMessageData = {
        to: outText.player_number,
        text: outText.body,
        mediaUrl: outText.media_url,
      };

      if (DB_ENV === 'local' || Meteor.isProduction) {
        console.log(`DB:${DB_ENV}, will send message`, outText);
        sendMessage(outMessage).then(async (external_id) => {
          await Meteor.callAsync(
            'outTexts.setExternalId',
            outText._id,
            external_id,
          );
          await Meteor.callAsync(
            'outTexts.updateStatus',
            outText._id,
            'api-sent',
          );
        });
      } else {
        console.log(`DB:${DB_ENV} and on dev, not sending message`, outText);
      }
    },
  });
};

Meteor.startup(() => {
  if (hasStartedUp) return;
  hasStartedUp = true;
  initializeWhatsappHandler();
});
