import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

const waToken: string = Meteor.settings.private.waSystemToken;
const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waAPIVersion = 'v18.0';

interface OutgoingMessageData {
  to: string;
  text: string;
  mediaUrl?: string;
}

interface OutgoingMessagePayloadBase {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type:
    | 'text'
    | 'image'
    | 'audio'
    | 'video'
    | 'sticker'
    | 'reaction'
    | 'interactive';
  text?: OutgoingMessagePayloadText;
  image?: OutgoingMessagePayloadImage;
  reaction?: OutgoingMessagePayloadReaction;
  context?: OutgoingMessagePayloadReply;
  interactive?: OutgoingMessagePayloadInteractive;
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

interface OutgoingMessagePayloadInteractive {
  type: 'button' | 'list';
  header?: {
    type: 'text' | 'image';
    text?: 'string';
    image?: {
      link: 'string';
    };
  };
  body: {
    text: 'string';
  };
  footer?: {
    text: 'string';
  };
  action: {
    buttons: OutgoingMessagePayloadInteractiveButton[];
    button: string;
    sections: OutgoingMessagePayloadInteractiveSection[];
  };
}

interface OutgoingMessagePayloadInteractiveButton {
  type: 'reply';
  reply: {
    id: 'string';
    title: 'string';
  };
}

interface OutgoingMessagePayloadInteractiveSection {
  title: 'string';
  rows: OutgoingMessagePayloadInteractiveRow[];
}

interface OutgoingMessagePayloadInteractiveRow {
  id: 'string';
  title: 'string';
  description?: 'string';
}

interface WaContact {
  input: string;
  wa_id: string;
}

interface OutgoingMessageResponseId {
  id: string;
}

interface OutgoingMessageResponse {
  messaging_product: 'whatsapp';
  contacts: WaContact[];
  messages: OutgoingMessageResponseId[];
}

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

  console.log('Sending message', payload);

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

export { sendMessage, OutgoingMessageData };
