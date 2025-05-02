import { Meteor } from 'meteor/meteor';

import Events from './events';

Meteor.methods({
  'events.new': (event) => {
    if (event.active) Meteor.call('events.activate', null, true);
    return Events.insert(event);
  },

  'events.update': (event) => {
    Events.update(event._id, { $set: event });
  },

  'events.delete': (eventId) => {
    if (Array.isArray(eventId)) {
      Events.remove({ _id: { $in: eventId } });
    } else {
      Events.remove(eventId);
    }
  },

  'events.activate': (eventId, deactivate) => {
    if (!eventId || deactivate) {
      Events.update({}, { $set: { active: false } }, { multi: true });
    } else {
      Events.update(
        { _id: { $ne: eventId } },
        { $set: { active: false } },
        { multi: true },
      );
      Events.update(eventId, { $set: { active: true } });
    }
  },

  'events.reset': (eventId) => {
    Meteor.call('inTexts.resetEvent', eventId);
    Meteor.call('outTexts.resetEvent', eventId);
    Meteor.call('aliases.resetEvent', eventId);
    Meteor.call('players.resetEvent', eventId);
    Meteor.call('media.resetEvent', eventId);
    Meteor.call('achievements.resetEvent', eventId);
    Meteor.call('achievementUnlocks.resetEvent', eventId);
    Meteor.call('checkpoints.resetEvent', eventId);
    Meteor.call('missions.resetEvent', eventId);
    Meteor.call('missionPairings.resetEvent', eventId);
    // Meteor.call('rounds.resetEvent', eventId);
    // Meteor.call('clues.resetEvent', eventId);
    // Meteor.call('clueRewards.resetEvent', eventId);
    // Meteor.call('guesses.resetEvent', eventId);
    Meteor.call('slotMachines.resetEvent', eventId);
    Meteor.call('roulettes.resetEvent', eventId);
    Meteor.call('rouletteBets.resetEvent', eventId);
    Meteor.call('quests.resetEvent', eventId);
    Meteor.call('derby.races.resetEvent', eventId);
    Meteor.call('derby.tellers.resetEvent', eventId);
    Meteor.call('derby.horses.resetEvent', eventId);
    Meteor.call('derby.raceBets.resetEvent', eventId);
    Meteor.call('derby.powerups.resetEvent', eventId);
    Meteor.call('derby.fortunes.resetEvent', eventId);
  },

  'events.copyFrom': (destinationEventId, sourceEventId) => {
    Meteor.call('achievements.copyFrom', destinationEventId, sourceEventId);
    Meteor.call('autoTexts.copyFrom', destinationEventId, sourceEventId);
    Meteor.call('missions.copyFrom', destinationEventId, sourceEventId);
    Meteor.call('quests.copyFrom', destinationEventId, sourceEventId);
  },
});
