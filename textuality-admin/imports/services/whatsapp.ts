import { ServerResponse, IncomingMessage } from 'http';
import { URL } from 'url';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import bodyParser from 'body-parser';
import { fetch } from 'meteor/fetch';

const waToken: string = Meteor.settings.private.waSystemToken;
const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waWebhookToken: string = Meteor.settings.private.waWebhookToken;
const waAPIVersion = 'v18.0';

interface WhatsappImage {
  mime_type: string;
  id: string;
}

interface MessageData {
  id: string;
  source: string;
  type: string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
  image?: WhatsappImage;
}

type MessageText = {
  body: string;
};

type MessageImage = {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
};

interface MessageRaw {
  id: string;
  type: string;
  timestamp: string;
  from: string;
  text?: MessageText;
  image?: MessageImage;
}

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
}

interface OutgoingMessagePayloadReaction {
  message_id: string;
  emoji: string;
}

interface OutgoingMessagePayloadReply {
  message_id: string;
}

let onReceiveText: (message: MessageData) => void = (message) => {
  console.log('message received', message);
};

function onReceive(callback: (message: MessageData) => void) {
  if (typeof callback === 'function') onReceiveText = callback;
}

function waVerify(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  if (req.url == null) return;
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = url.searchParams;

  if (
    params.get('hub.mode') == 'subscribe' &&
    params.get('hub.verify_token') == waWebhookToken
  ) {
    res.write(params.get('hub.challenge'));
    res.end();
  } else {
    console.log('Error, params', params);
    res.statusCode = 400;
    res.write('Challenge failed');
    res.end();
  }
}

function getWaText(messageRaw: MessageRaw): string {
  if (messageRaw.type === 'text') {
    // @ts-ignore
    return messageRaw.text.body;
  }
  if (messageRaw.type === 'image') {
    // @ts-ignore
    return messageRaw.image.caption;
  }
  return '';
}

function waMessage(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  // @ts-ignore
  const body = req.body;

  const valueRaw = body.entry[0].changes[0].value;
  const sentTo: string = valueRaw.metadata.phone_number_id;
  const messageRaw: MessageRaw = valueRaw.messages[0];

  const timestamp = new Date(Number(parseInt(messageRaw.timestamp) * 1000));
  const text = getWaText(messageRaw);

  const message: MessageData = {
    id: messageRaw.id,
    source: 'whatsapp',
    type: messageRaw.type,
    from: messageRaw.from,
    to: sentTo,
    timestamp,
    text,
  };

  if (messageRaw.type === 'image') {
    message.image = {
      // @ts-ignore
      id: messageRaw.image.id,
      // @ts-ignore
      mime_type: messageRaw.image.mime_type,
    };
  }

  onReceiveText(message);
  res.statusCode = 200;
  res.end();

  markAsRead(message.id);
}

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

function send(message: OutgoingMessageData): boolean {
  const whatsappSendEndpoint = `https://graph.facebook.com/${waAPIVersion}/${waPhoneNumberId}/messages`;

  const payload: OutgoingMessagePayloadBase = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: message.to,
    type: 'image',
    text: {
      body: message.text,
    },
  };

  fetch(whatsappSendEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${waToken}`,
    },
    body: JSON.stringify(payload),
  });

  return true;
}

function init() {
  WebApp.connectHandlers.use('/whatsapp-handler', bodyParser.json());
  WebApp.connectHandlers.use('/whatsapp-handler', (req, res) => {
    if (req.method == 'GET') {
      waVerify(req, res);
    }

    if (req.method == 'POST') {
      waMessage(req, res);
    }
  });
}

init();

export { onReceive, send };
