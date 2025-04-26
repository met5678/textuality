export type OutgoingMessageData = {
  to: string;
  text: string;
  mediaUrl?: string;
};

export type OutgoingMessagePayloadBase = {
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
};

export type OutgoingMessagePayloadText = {
  body: string;
};

export type OutgoingMessagePayloadImage = {
  link: string;
  caption?: string;
};

export type OutgoingMessagePayloadReaction = {
  message_id: string;
  emoji: string;
};

export type OutgoingMessagePayloadReply = {
  message_id: string;
};

export type OutgoingMessagePayloadInteractive = {
  type: 'button' | 'list';
  header?: {
    type: 'text' | 'image';
    text?: string;
    image?: {
      link: string;
    };
  };
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: {
    buttons: OutgoingMessagePayloadInteractiveButton[];
    button: string;
    sections: OutgoingMessagePayloadInteractiveListSection[];
  };
};

export type OutgoingMessagePayloadInteractiveButton = {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
};

export type OutgoingMessagePayloadInteractiveListSection = {
  title: string;
  rows: OutgoingMessagePayloadInteractiveListRow[];
};

export type OutgoingMessagePayloadInteractiveListRow = {
  id: string;
  title: string;
  description?: string;
};

export type WaContact = {
  input: string;
  wa_id: string;
};

export type OutgoingMessageResponseId = {
  id: string;
};

export type OutgoingMessageResponse = {
  messaging_product: 'whatsapp';
  contacts: WaContact[];
  messages: OutgoingMessageResponseId[];
};
