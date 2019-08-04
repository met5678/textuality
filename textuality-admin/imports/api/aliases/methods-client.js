import { Meteor } from 'meteor/meteor';

import Aliases from './aliases';
import Events from 'api/events';

Meteor.methods({
  'aliases.checkout': () => {
    const aliases = Aliases.find({
      event: Events.currentId(),
      used: false
    }).fetch();
    if (!aliases.length) {
      return 'No Aliases Left';
    }
    const newAlias = aliases[Math.floor(Math.random() * aliases.length)];
    Aliases.update(newAlias._id, { $set: { used: true } });
    return newAlias.name;
  },

  'aliases.release': (aliasName, didUse) => {
    if (!didUse) {
      Aliases.update(
        { name: aliasName, event: Events.currentId() },
        { $set: { used: false } }
      );
    }
  }
});
