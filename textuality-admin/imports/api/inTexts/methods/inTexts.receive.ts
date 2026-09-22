import { Meteor } from 'meteor/meteor';
import Events from '../../events';
import { PlayerWithHelpers } from '../../players/players';
import getPurpose from '../get-purpose/get-purpose';
import InTexts from '../inTexts';
import { processInteractive } from '../process-interactive/process-interactive';
import processHashtagText from '../process-purpose/process-hashtag-text';
import processInitialText from '../process-purpose/process-initial-text';
import processSystemText from '../process-purpose/process-system-text';
import { InText } from '/imports/schemas/inText';
import { IncomingMessageData } from '/imports/services/whatsapp';
import { getWrappedServerMethod } from '/imports/utils/get-wrapped-server-method';
import { processCasinoText } from '../process-purpose/casino/process-casino-text';
import { processDerbyText } from '../process-purpose/derby/process-derby-text';
import { EventTheme } from '/imports/schemas/event';
import processFeedText from '../process-purpose/process-feed-text';

const processByTheme: Record<
  EventTheme,
  (inText: InText, player: PlayerWithHelpers) => Promise<void> | undefined
> = {
  derby: processDerbyText,
  casino: processCasinoText,
  clue: async () => {},
};

export const receiveInText = async (message: IncomingMessageData) => {
  const event = Events.currentOrThrow();

  const player: PlayerWithHelpers = await Meteor.callAsync(
    'players.findOrJoin',
    message.from,
  );
  const purpose = await getPurpose({ message, player, theme: event.theme });

  const inTextRaw: Omit<InText, '_id'> = {
    event: event._id,
    player: player._id,
    body: message.text,
    time: new Date(),
    purpose,
    alias: player.alias,
    avatar: player.avatar,
    numAchievements: player.numAchievements,
  };

  if (message.media) {
    inTextRaw.media = Meteor.call('media.receive', {
      purpose,
      message,
      player,
    });
  }

  if (message.interactive) {
    inTextRaw.interactive = await processInteractive(message);
  }

  const id = await InTexts.insertAsync(inTextRaw);
  const inText: InText = { ...inTextRaw, _id: id };

  Meteor.call('players.updateAfterInText', inText);

  if (inText.purpose === 'initial') {
    await processInitialText(inText, player);
  } else if (inText.purpose === 'system') {
    processSystemText(inText, player);
  } else if (inText.purpose === 'hashtag') {
    processHashtagText(inText, player);
  } else if (inText.purpose === 'feed') {
    processFeedText(inText, player);
  } else if (processByTheme[event.theme]) {
    processByTheme[event.theme](inText, player);
  }

  Meteor.call('achievements.checkAfterInText', inText);
};

export const receiveInTextMethod = getWrappedServerMethod(
  'inTexts.receive',
  receiveInText,
);
