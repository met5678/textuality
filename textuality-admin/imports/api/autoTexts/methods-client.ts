import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import Events from '/imports/api/events';
import Players from '/imports/api/players';

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

    Meteor.call('autoTexts.sendCustom', {
      ...autoText,
      playerId,
      mediaUrl,
      templateVars,
      source: 'auto',
    });
  },

  /*
  'autoTexts.sendStatus': ({ playerId }) => {
    const player = Players.findOne(playerId);
    if (!player) return;

    Meteor.call('autoTexts.send', { playerId, trigger: 'STATUS_GENERATING' });

    const lines = [];

    const clueRewards = ClueRewards.find(
      {
        event: Events.currentId(),
        round: Rounds.currentId(),
        player: playerId,
      },
      { sort: { clueName: 1 } },
    ).fetch();
    const roomClues = clueRewards.filter(
      (clueReward) => clueReward.clueType === 'room',
    );
    const personClues = clueRewards.filter(
      (clueReward) => clueReward.clueType === 'person',
    );
    const weaponClues = clueRewards.filter(
      (clueReward) => clueReward.clueType === 'weapon',
    );

    lines.push(`Case file for ${player.alias}:\n`);

    lines.push('Your current guess:');
    const playerGuess = Guesses.findOne({
      event: Events.currentId(),
      round: Rounds.currentId(),
      player: playerId,
    });
    lines.push(`Room: ${capitalizeFirstLetter(playerGuess?.room ?? '--')}`);
    lines.push(
      `Suspect: ${capitalizeFirstLetter(playerGuess?.person ?? '--')}`,
    );
    lines.push(`Weapon: ${capitalizeFirstLetter(playerGuess?.weapon ?? '--')}`);

    lines.push(`\n----------------\n`);

    lines.push(`Eliminated Rooms:${roomClues.length === 0 ? ' NONE' : ''}`);
    roomClues.forEach((clueReward, i) =>
      lines.push(`${i + 1}. ${clueReward.clueName}`),
    );

    lines.push(`\nCleared Suspects:${personClues.length === 0 ? ' NONE' : ''}`);
    personClues.forEach((clueReward, i) =>
      lines.push(`${i + 1}. ${clueReward.clueName}`),
    );

    lines.push(
      `\nEliminated Weapons:${weaponClues.length === 0 ? ' NONE' : ''}`,
    );
    weaponClues.forEach((clueReward, i) =>
      lines.push(`${i + 1}. ${clueReward.clueName}`),
    );

    lines.push(`\n----------------\n`);
    // const unlocks = AchievementUnlocks.find({
    //   player: playerId,
    //   event: Events.currentId(),
    // }).fetch();
    // const allAchievements = Achievements.find({
    //   event: Events.currentId(),
    // }).fetch();

    // lines.push(
    //   `Achievements Unlocked: ${unlocks.length}/${allAchievements.length}`
    // );

    // if (unlocks.length < allAchievements.length) {
    //   lines.push('Missing Achievements:');
    //   const missingAchievements = allAchievements
    //     .filter(
    //       (achievement) =>
    //         !unlocks.some((unlock) => unlock.achievement === achievement._id)
    //     )
    //     .forEach((achievement) => {
    //       lines.push(`- ${achievement.name}`);
    //     });
    // }

    // lines.push('\n');

    let checkpointGroups = Checkpoints.find(
      { event: Events.currentId() },
      { fields: { group: 1 } },
    )
      .fetch()
      .reduce((groups, checkpoint) => {
        if (!groups[checkpoint.group])
          groups[checkpoint.group] = { found: 0, total: 1 };
        else groups[checkpoint.group].total++;
        return groups;
      }, {});

    checkpointGroups = player.checkpoints.reduce((groups, checkpoint) => {
      groups[checkpoint.group].found++;
      return groups;
    }, checkpointGroups);

    lines.push(`Evidence found:`);
    let unfoundHashtags = 0;
    let didFind = false;
    Object.keys(checkpointGroups).forEach((group) => {
      const { found, total } = checkpointGroups[group];
      if (found) {
        didFind = true;
        lines.push(`- ${group}: ${found}/${total}`);
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

    Meteor.call('autoTexts.sendCustom', {
      playerId,
      source: 'auto',
      playerText: lines.join('\n'),
    });
  },
  */

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
      let body = playerText.replace(/\[alias\]/g, player.alias);
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
