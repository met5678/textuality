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

type MessageInteractive =
  | {
      type: 'button_reply';
      button_reply: {
        id: string;
        title: string;
      };
    }
  | {
      type: 'list_reply';
      list_reply: {
        id: string;
        title: string;
        description?: string;
      };
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

interface MessageWithInteractive extends MessageBase {
  type: 'interactive';
  context: {
    /* Should be Textuality's phone number */
    from: string;
    /* Should be the external id of the message that was replied to */
    id: string;
  };
  interactive: MessageInteractive;
}

type MessageRaw =
  | MessageWithText
  | MessageWithImage
  | MessageWithVideo
  | MessageWithInteractive;

interface IncomingMessageMedia {
  content_type: string;
  mime_type: string;
  url: string;
  external_id: string;
}

interface IncomingMessageInteractive {
  original_external_id: string;
  type: 'button_reply' | 'list_reply';
  value: string;
  label: string;
}

interface IncomingMessageData {
  id: string;
  source: string;
  from: string;
  to: string;
  timestamp: Date;
  text: string;
  media?: IncomingMessageMedia;
  interactive?: IncomingMessageInteractive;
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

  if (messageRaw.type === 'interactive') {
    message.interactive = {
      original_external_id: messageRaw.context.id,
      type: messageRaw.interactive.type,
      value:
        messageRaw.interactive.type === 'button_reply'
          ? messageRaw.interactive.button_reply.id
          : messageRaw.interactive.list_reply.id,
      label:
        messageRaw.interactive.type === 'button_reply'
          ? messageRaw.interactive.button_reply.title
          : messageRaw.interactive.list_reply.title,
    };
  }

  onReceiveText(message);
  markAsRead(message.id);
}

export { processWaMessage, onReceive, MessageRaw, IncomingMessageData };
