import { markAsRead } from './wa-markread';

interface WhatsappImage {
  mime_type: string;
  id: string;
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

interface IncomingMessageData {
  id: string;
  source: string;
  type: string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
  image?: WhatsappImage;
}

let onReceiveText: (message: IncomingMessageData) => void = () => {};

function onReceive(callback: (message: IncomingMessageData) => void) {
  if (typeof callback === 'function') onReceiveText = callback;
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

function processWaMessage(messageRaw: MessageRaw, sentTo: string) {
  const timestamp = new Date(Number(parseInt(messageRaw.timestamp) * 1000));
  const text = getWaText(messageRaw);

  const message: IncomingMessageData = {
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
  markAsRead(message.id);
}

export { processWaMessage, onReceive, MessageRaw, IncomingMessageData };
