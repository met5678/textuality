import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

const waToken: string = Meteor.settings.private.waSystemToken;
const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waAPIVersion = 'v18.0';

async function markAsRead(messageId: string): Promise<boolean> {
  const whatsappSendEndpoint = `https://graph.facebook.com/${waAPIVersion}/${waPhoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    status: 'read',
    message_id: messageId,
  };

  const response = await fetch(whatsappSendEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${waToken}`,
    },
    body: JSON.stringify(payload),
  });

  console.log('Response', await response.json());

  return true;
}

export { markAsRead };
