import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import {
  OutgoingButtonInteractiveMessage,
  OutgoingListInteractiveMessage,
  OutgoingMessageData,
  OutgoingMessagePayloadBase,
  OutgoingMessagePayloadInteractive,
  OutgoingMessageResponse,
} from './wa-types';

const waToken: string = Meteor.settings.private.waSystemToken;
const waPhoneNumberId: number = Meteor.settings.private.waPhoneNumberId;
const waAPIVersion = 'v18.0';

const getInteractivePayload = (
  message: OutgoingMessageData,
): OutgoingMessagePayloadInteractive | undefined => {
  const interactive = message.interactive;
  if (!interactive) return undefined;

  const header = message.mediaUrl
    ? {
        type: 'image' as const,
        image: {
          link: message.mediaUrl,
        },
      }
    : undefined;

  const body = {
    text: message.text,
  };

  const basePayload = {
    header,
    body,
  };

  if (interactive.type === 'buttons') {
    const buttonPayload: OutgoingButtonInteractiveMessage = {
      ...basePayload,
      type: 'button',
      action: {
        buttons: interactive.options.map((option) => ({
          type: 'reply' as const,
          reply: { id: option.value, title: option.label },
        })),
      },
    };
    return buttonPayload;
  } else {
    const listPayload: OutgoingListInteractiveMessage = {
      ...basePayload,
      type: 'list',
      action: {
        button: 'Select an option',
        sections: [
          {
            title: 'Options',
            rows: interactive.options.map((option) => ({
              id: option.value,
              title: option.label,
            })),
          },
        ],
      },
    };
    return listPayload;
  }
};

async function sendMessage(message: OutgoingMessageData): Promise<string> {
  const whatsappSendEndpoint = `https://graph.facebook.com/${waAPIVersion}/${waPhoneNumberId}/messages`;

  const payload: OutgoingMessagePayloadBase = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: message.to,
    type: 'text',
  };

  if (message.interactive) {
    payload.type = 'interactive';
    payload.interactive = getInteractivePayload(message);
  } else if (message.mediaUrl) {
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
