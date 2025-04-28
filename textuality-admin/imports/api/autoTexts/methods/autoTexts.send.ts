import { Meteor } from 'meteor/meteor';
import Events from '../../events';
import AutoTexts from '../autoTexts';
import { AutoTextTrigger } from '/imports/schemas/autoText';
import { OutTextInteractivePayload } from '/imports/schemas/outText';
import { PlayerId } from '/imports/schemas/player';
import { sendCustomAutoText } from './autoTexts.sendCustom';

export type AutoTextSendArgs = {
  trigger: AutoTextTrigger;
  triggerNum?: number;
  playerId: PlayerId;
  mediaUrl?: string;
  interactivePayload?: OutTextInteractivePayload;
  templateVars?: Record<string, any>;
};

export const sendAutoText = async ({
  trigger,
  triggerNum,
  playerId,
  mediaUrl,
  interactivePayload,
  templateVars = {},
}: AutoTextSendArgs) => {
  const autoTextQuery: Record<string, any> = {
    event: Events.currentIdOrThrow(),
    trigger,
  };
  if (triggerNum) autoTextQuery.triggerNum = triggerNum;

  const matchingAutoTexts = AutoTexts.find(autoTextQuery).fetch();
  if (matchingAutoTexts.length === 0) {
    console.log('No matching autoTexts', { trigger, triggerNum });
    return;
  }

  const autoText =
    matchingAutoTexts[Math.floor(Math.random() * matchingAutoTexts.length)];

  if (!mediaUrl) mediaUrl = autoText.image_url ?? undefined;

  sendCustomAutoText({
    ...autoText,
    playerId,
    mediaUrl,
    templateVars,
    interactivePayload,
    source: 'auto',
  });
};

export const autoTexts_send = async (args: AutoTextSendArgs) => {
  Meteor.callAsync('autoTexts.send', args);
};
