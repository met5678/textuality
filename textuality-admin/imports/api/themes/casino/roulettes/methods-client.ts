import { Meteor } from 'meteor/meteor';
import Roulettes from './roulettes';
import Players from '/imports/api/players';
import generateHackerClue from './hacker-clues/generate-hacker-clue';

import './methods/roulettes.findCurrent';
import './methods/roulettes.findNext';
import './methods/roulettes.doPayouts';
import './methods/roulettes.openBets';
import './methods/roulettes.startSpin';
import './methods/roulettes.finishSpin';
import './methods/roulettes.revealWinners';
import './methods/roulettes.deactivateRoulette';

Meteor.methods({
  'roulettes.sendHackerClue': ({ missionId, playerId }) => {
    const roulette = Roulettes.findOne({
      linked_mission: missionId,
    });

    const player = Players.findOne(playerId);

    if (!roulette || !player) return;
    if (!roulette.result) return;

    generateHackerClue({ roulette, player });
  },
});
