import { Meteor } from 'meteor/meteor';

import Horses from './horses';
import Events from '/imports/api/events';
import { Horse } from '/imports/schemas/derby/horse';

Meteor.methods({
  'horses.new': (horse) => {
    const id = Horses.insert(horse);
    return id;
  },

  'horses.update': (horse) => {
    Horses.update(horse._id, { $set: horse });
  },

  'horses.duplicate': (horseId) => {
    const horseToDuplicate = Horses.findOne(horseId);
    if (!horseToDuplicate) return;
    const { _id, getTotalStats, ...duplicatedHorse } = horseToDuplicate;
    Horses.insert(duplicatedHorse as unknown as Horse);
  },

  'horses.delete': (horseId) => {
    if (Array.isArray(horseId)) {
      Horses.remove({ _id: { $in: horseId } });
    } else {
      Horses.remove(horseId);
    }
  },

  'horses.resetEvent': (event_id) => {
    Horses.update(
      { event: event_id },
      {
        $set: {
          stats: {
            speed: 10,
            endurance: 10,
            luck: 10,
            traction: 10,
            distractibility: 10,
            boots: 1,
          },
        },
      },
      { multi: true },
    );
  },
});
