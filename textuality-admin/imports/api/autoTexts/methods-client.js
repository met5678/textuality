import { Meteor } from 'meteor/meteor';

import AutoTexts from './autoTexts';
import Events from 'api/events';
import Players from 'api/players';
import Achievements from 'api/achievements';
import AchievementUnlocks from 'api/achievementUnlocks';
import Checkpoints from 'api/checkpoints';

Meteor.methods({
  'autoTexts.send': ({ trigger, triggerNum, playerId, templateVars }) => {
    const autoTextQuery = { event: Events.currentId(), trigger };
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
      templateVars,
      source: 'auto'
    });
  },

  'autoTexts.sendStatus': ({ playerId }) => {
    const player = Players.findOne(playerId);
    if (!player) return;

    Meteor.call('autoTexts.send', { playerId, trigger: 'STATUS_GENERATING' });

    const lines = [];

    lines.push(`STATUS REPORT`);
    lines.push(`Current alias: "${player.alias}"`);
    lines.push('\n');
    lines.push(`Texts sent to feed: ${player.feedTextsSent}`);
    lines.push(`Images sent to feed: ${player.feedMediaSent}`);
    lines.push('\n');

    const unlocks = AchievementUnlocks.find({
      player: playerId,
      event: Events.currentId()
    }).fetch();
    const allAchievements = Achievements.find({
      event: Events.currentId()
    }).fetch();

    lines.push(
      `Achievements Unlocked: ${unlocks.length}/${allAchievements.length}`
    );

    if (unlocks.length < allAchievements.length) {
      lines.push('Missing Achievements:');
      const missingAchievements = allAchievements
        .filter(
          achievement =>
            !unlocks.some(unlock => unlock.achievement === achievement._id)
        )
        .forEach(achievement => {
          lines.push(`- ${achievement.name}`);
        });
    }

    lines.push('\n');

    let checkpointGroups = Checkpoints.find(
      { event: Events.currentId() },
      { fields: { group: 1 } }
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

    lines.push(`Hashtags Discovered:`);
    let unfoundHashtags = 0;
    let didFind = false;
    Object.keys(checkpointGroups).forEach(group => {
      const { found, total } = checkpointGroups[group];
      if (found) {
        didFind = true;
        lines.push(`${found}/${total} ${group} hashtags`);
      } else {
        unfoundHashtags += total;
      }
    });

    if (unfoundHashtags) {
      if (didFind) {
        lines.push(`...and ${unfoundHashtags} more elsewhere!`);
      } else {
        lines.push(`...you haven't found any yet! Find some and text them in.`);
      }
    }

    Meteor.call('autoTexts.sendCustom', {
      playerId,
      source: 'auto',
      playerText: lines.join('\n')
    });
  },

  'autoTexts.sendCustom': ({
    playerText,
    screenText,
    playerId,
    mediaUrl,
    templateVars = {},
    source = 'unknown'
  }) => {
    const player = Players.findOne(playerId);

    if (playerText) {
      let body = playerText.replace(/\[alias\]/g, player.alias);
      Object.keys(templateVars).forEach(key => {
        body = body.replace(new RegExp(`\\[${key}\\]`, 'g'), templateVars[key]);
      });

      Meteor.call('outTexts.send', {
        players: [player],
        body,
        source: 'auto',
        mediaUrl
      });
    }

    // if (screenText) {
    //   const body = screenText.replace('[alias]', player.alias);
    //   Meteor.call('inTexts.sendSystemText', { body, player });
    // }
  }
});
