import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import Events from '/imports/api/events';
import Players from '/imports/api/players';
import Checkpoints from '../checkpoints';

const capitalizeFirstLetter = (str: string) =>
  `${str[0].toUpperCase()}${str.substring(1)}`;

Meteor.methods({
  'autoTexts.send': ({
    trigger,
    triggerNum,
    playerId,
    mediaUrl,
    templateVars,
  }) => {
    const autoTextQuery: Record<string, any> = {
      event: Events.currentId(),
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

    Meteor.call('autoTexts.sendCustom', {
      ...autoText,
      playerId,
      mediaUrl,
      templateVars,
      source: 'auto',
    });
  },

  'autoTexts.sendStatus': ({ playerId }) => {
    const player = Players.findOne(playerId);
    if (!player) return;

    let checkpointLocations = Checkpoints.find(
      { event: Events.currentId()! },
      { fields: { location: 1, suppress_autotext: 1 } },
    )
      .fetch()
      .reduce<
        Record<string, { found: number; total: number; hidden: boolean }>
      >((locations, checkpoint) => {
        if (!locations[checkpoint.location])
          locations[checkpoint.location] = {
            found: 0,
            total: 1,
            hidden: !!checkpoint.suppress_autotext,
          };
        else {
          locations[checkpoint.location].total++;
          if (!checkpoint.suppress_autotext)
            locations[checkpoint.location].hidden = false;
        }
        return locations;
      }, {});

    checkpointLocations = player.checkpoints.reduce((locations, checkpoint) => {
      if (!locations[checkpoint.location]) return locations;
      locations[checkpoint.location].found++;
      return locations;
    }, checkpointLocations);

    let unfoundHashtags = 0;
    let didFind = false;
    const lines: string[] = [];
    Object.keys(checkpointLocations).forEach((location) => {
      const { found, total, hidden } = checkpointLocations[location];
      if (hidden) return;
      if (found) {
        didFind = true;
        lines.push(`- ${location}: ${found}/${total}`);
      } else {
        unfoundHashtags += total;
      }
    });

    if (unfoundHashtags) {
      if (didFind) {
        lines.push(`...and ${unfoundHashtags} left elsewhere!`);
      } else {
        lines.push(`...you haven't found any yet! Find some and text them in.`);
      }
    }

    Meteor.call('autoTexts.send', {
      trigger: 'WALLET_STATUS',
      playerId,
      templateVars: {
        checkpoint_list: lines.join('\n'),
      },
      source: 'auto',
    });
  },

  'autoTexts.sendCustom': ({
    playerText,
    playerId,
    mediaUrl,
    templateVars = {},
    source = 'auto',
  }) => {
    const player = Players.findOne(playerId);
    if (!player) return;

    if (playerText) {
      // let body = playerText.replace(/\[alias\]/g, player.alias);
      let body = playerText;
      templateVars.alias = player.alias;
      templateVars.money = player.money;
      Object.keys(templateVars).forEach((key) => {
        body = body.replace(new RegExp(`\\[${key}\\]`, 'g'), templateVars[key]);
      });

      Meteor.call('outTexts.send', {
        players: [player],
        body,
        source,
        mediaUrl,
      });
    }
  },
});
