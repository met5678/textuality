import { Meteor } from 'meteor/meteor';

import Events from '/imports/api/events';
import Players from '/imports/api/players';
import Checkpoints from '../checkpoints';

import { AutoTextSendArgs, sendAutoText } from './methods/autoTexts.send';
import {
  AutoTextSendCustomArgs,
  sendCustomAutoText,
} from './methods/autoTexts.sendCustom';
import { getPlayerPowerupSummary } from '../themes/derby/powerups/methods/powerups.getPlayerPowerupSummary';
import {
  racesGetCurrent,
  racesGetCurrentSync,
} from '../themes/derby/race/methods/races.getCurrent';
import { raceBetGetPlayerRaceBetSummary } from '../themes/derby/raceBets/methods/raceBet.getPlayerRaceBetSummary';
import {
  AutoTextSendBroadcastArgs,
  sendBroadcastCustomAutoText,
} from './methods/autoTexts.sendBroadcast';

Meteor.methods({
  'autoTexts.send': async (args: AutoTextSendArgs) => {
    await sendAutoText(args);
  },

  'autoTexts.sendStatus': async ({ playerId }) => {
    const player = await Players.findOneAsync(playerId);
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

    const powerupSummary = await getPlayerPowerupSummary(playerId);

    const currentRace = await racesGetCurrent();
    const raceBetSummary = currentRace
      ? await raceBetGetPlayerRaceBetSummary(playerId, currentRace._id, [
          'placed',
        ])
      : 'None';

    sendAutoText({
      trigger: 'WALLET_STATUS',
      playerId,
      templateVars: {
        checkpoint_list: lines.join('\n'),
        powerup_summary: powerupSummary,
        bet_summary: raceBetSummary,
      },
    });
  },

  'autoTexts.sendCustom': async (args: AutoTextSendCustomArgs) => {
    await sendCustomAutoText(args);
  },

  'autoTexts.sendBroadcastCustom': async (args: AutoTextSendBroadcastArgs) => {
    await sendBroadcastCustomAutoText(args);
  },
});
