import { getMediaUrl } from './wa-getmediaurl';
import { markAsRead } from './wa-markread';

type MessageText = {
  body: string;
};

type MessageImage = {
  caption: string;
  mime_type: string;
  sha256: string;
  id: string;
};

type MessageVideo = {
  caption: string;
  filename: string;
  mime_type: string;
  sha256: string;
  id: string;
};

interface MessageBase {
  id: string;
  timestamp: string;
  from: string;
}

interface MessageWithText extends MessageBase {
  type: 'text';
  text: MessageText;
}

interface MessageWithImage extends MessageBase {
  type: 'image';
  image: MessageImage;
}

interface MessageWithVideo extends MessageBase {
  type: 'video';
  video: MessageVideo;
}

type MessageRaw = MessageWithText | MessageWithImage | MessageWithVideo;

interface IncomingMessageMedia {
  content_type: string;
  mime_type: string;
  url: string;
  external_id: string;
}

interface IncomingMessageData {
  id: string;
  source: string;
  from: string;
  to: string;
  timestamp: Date;
  text: string;
  media?: IncomingMessageMedia;
}

let onReceiveText: (message: IncomingMessageData) => void = () => {};

function onReceive(callback: (message: IncomingMessageData) => void) {
  if (typeof callback === 'function') onReceiveText = callback;
}

function getWaText(messageRaw: MessageRaw): string {
  if (messageRaw.type === 'text') {
    return messageRaw.text.body;
  }
  if (messageRaw.type === 'image') {
    return messageRaw.image.caption;
  }
  if (messageRaw.type === 'video') {
    return messageRaw.video.caption;
  }
  return '';
}

async function processWaMessage(messageRaw: MessageRaw, sentTo: string) {
  const timestamp = new Date(Number(parseInt(messageRaw.timestamp) * 1000));
  const text = getWaText(messageRaw);

  console.log('Receiving', messageRaw);

  const message: IncomingMessageData = {
    id: messageRaw.id,
    source: 'whatsapp',
    from: messageRaw.from,
    to: sentTo,
    timestamp,
    text,
  };

  if (messageRaw.type === 'image') {
    message.media = {
      mime_type: messageRaw.image.mime_type,
      content_type: messageRaw.type,
      external_id: messageRaw.image.id,
      url: await getMediaUrl(messageRaw.image.id),
    };
  }

  if (messageRaw.type === 'video') {
    message.media = {
      mime_type: messageRaw.video.mime_type,
      content_type: messageRaw.type,
      external_id: messageRaw.video.id,
      url: await getMediaUrl(messageRaw.video.id),
    };
  }

  onReceiveText(message);
  markAsRead(message.id);
}

export { processWaMessage, onReceive, MessageRaw, IncomingMessageData };
