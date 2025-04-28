import { Meteor } from 'meteor/meteor';
import Players from '../../players/players';
import { OutTextInteractivePayload } from '/imports/schemas/outText';
import { OutTextSource } from '/imports/schemas/outText';
import { PlayerId } from '/imports/schemas/player';
import commaNumber from 'comma-number';

export type AutoTextSendCustomArgs = {
  playerText: string;
  playerId: PlayerId;
  mediaUrl?: string;
  templateVars: Record<string, any>;
  interactivePayload?: OutTextInteractivePayload;
  source?: OutTextSource;
};

export const sendCustomAutoText = async ({
  playerText,
  playerId,
  mediaUrl,
  templateVars,
  interactivePayload,
  source,
}: AutoTextSendCustomArgs) => {
  const player = await Players.findOneAsync(playerId);
  if (!player) return;

  if (playerText) {
    let body = playerText;
    templateVars.alias = player.alias;
    templateVars.money = player.money;
    Object.keys(templateVars).forEach((key) => {
      let value = templateVars[key];

      // If value is either a number or a string that can be converted to a number, format it with commas
      if (
        (typeof value === 'number' && !isNaN(value)) ||
        !isNaN(parseFloat(value))
      ) {
        value = commaNumber(value);
      }

      body = body.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });

    Meteor.callAsync('outTexts.send', {
      player,
      body,
      mediaUrl,
      source,
      interactivePayload,
    });
  }
};

export const autoTexts_sendCustom = async (args: AutoTextSendCustomArgs) => {
  Meteor.callAsync('autoTexts.sendCustom', args);
};
