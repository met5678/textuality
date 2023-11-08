import { Meteor } from 'meteor/meteor';

import Players from '../../players';
import { InText } from '/imports/schemas/inText';

const processPercentText = function (inText: InText) {
  const player = Players.findOne(inText.player);
  if (!player) return;

  const playerId = player._id;

  const firstSpace =
    inText.body.indexOf(' ') > 0
      ? inText.body.indexOf(' ')
      : inText.body.length;
  const betCode = inText.body.substring(1, firstSpace).trim().toLowerCase();
  const rest = inText.body.substring(firstSpace);

  const slotMachine = Meteor.call('slotMachines.getForShort', betCode);
  if (slotMachine) {
    Meteor.call('slotMachines.spinRequest', {
      slot_id: slotMachine._id,
      player_id: playerId,
      inText_id: inText._id,
    });
    return;
  }

  Meteor.call('autoTexts.send', {
    playerId,
    trigger: 'INVALID_BET',
    templateVars: {
      betCode,
    },
  });
};

export default processPercentText;
