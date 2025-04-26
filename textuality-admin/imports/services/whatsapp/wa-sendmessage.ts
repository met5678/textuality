import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import {
  OutgoingMessageData,
  OutgoingMessagePayloadBase,
  OutgoingMessageResponse,
} from './wa-types';

const waToken: string = Meteor.settings.private.waSystemToken;
const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waAPIVersion = 'v18.0';

async function sendMessage(message: OutgoingMessageData): Promise<string> {
  const whatsappSendEndpoint = `https://graph.facebook.com/${waAPIVersion}/${waPhoneNumberId}/messages`;

  const payload: OutgoingMessagePayloadBase = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: message.to,
    type: 'text',
  };

  if (message.mediaUrl) {
    payload.type = 'image';
    payload.image = {
      link: message.mediaUrl,
    };
    if (message.text) {
      payload.image.caption = message.text;
    }
  } else {
    payload.type = 'text';
    payload.text = {
      body: message.text,
    };
  }

  const result = await fetch(whatsappSendEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${waToken}`,
    },
    body: JSON.stringify(payload),
  });

  const jsonResult: OutgoingMessageResponse = await result.json();
  const waId = jsonResult.messages?.[0]?.id ?? '';

  console.log('Sent message', waId);

  return waId;
}

export { sendMessage };
