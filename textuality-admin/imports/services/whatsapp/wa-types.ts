export type OutgoingMessageData = {
  to: string;
  text: string;
  mediaUrl?: string;
  interactive?: {
    type: 'buttons' | 'list';
    options: {
      value: string;
      label: string;
    }[];
  };
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

export type OutgoingInteractiveMessageBase = {
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
};

export type OutgoingButtonInteractiveMessage =
  OutgoingInteractiveMessageBase & {
    type: 'button';
    action: {
      buttons: OutgoingMessagePayloadInteractiveButton[];
    };
  };

export type OutgoingListInteractiveMessage = OutgoingInteractiveMessageBase & {
  type: 'list';
  action: {
    button: string;
    sections: OutgoingMessagePayloadInteractiveListSection[];
  };
};

export type OutgoingMessagePayloadInteractive =
  | OutgoingButtonInteractiveMessage
  | OutgoingListInteractiveMessage;

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
