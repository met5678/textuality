import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

const waToken: string = Meteor.settings.private.waSystemToken;
const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waAPIVersion = 'v18.0';

interface OutgoingMessageData {
  to: string;
  from: string;
  text: string;
  mediaUrl?: string;
}

interface OutgoingMessagePayloadBase {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'sticker' | 'reaction';
  text?: OutgoingMessagePayloadText;
  image?: OutgoingMessagePayloadImage;
  reaction?: OutgoingMessagePayloadReaction;
  context?: OutgoingMessagePayloadReply;
}

interface OutgoingMessagePayloadText {
  body: string;
}

interface OutgoingMessagePayloadImage {
  link: string;
  caption?: string;
}

interface OutgoingMessagePayloadReaction {
  message_id: string;
  emoji: string;
}

interface OutgoingMessagePayloadReply {
  message_id: string;
}

async function sendMessage(message: OutgoingMessageData): Promise<boolean> {
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

  await fetch(whatsappSendEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${waToken}`,
    },
    body: JSON.stringify(payload),
  });

  return true;
}

export { sendMessage, OutgoingMessageData };
