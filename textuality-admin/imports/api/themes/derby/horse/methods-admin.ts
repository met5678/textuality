import { Meteor } from 'meteor/meteor';

import Horses from './horses';
import Events from '/imports/api/events';
import {
  Horse,
  HorseId,
  HorseStats,
  HorseStatsSchema,
} from '/imports/schemas/derby/horse';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';
import { EventId } from '/imports/schemas/event';

Meteor.methods({
  'derby.horses.new': async (horse: OptionalId<Horse>) => {
    const id = await Horses.insertAsync(horse);
    return id;
  },

  'derby.horses.update': async (horse: UpdateRequiredId<Horse>) => {
    await Horses.updateAsync(horse._id, { $set: horse });
    return await Horses.findOneAsync(horse._id);
  },

  'derby.horses.upsert': async (horse: OptionalId<Horse>) => {
    if (!horse._id) {
      const id = await Horses.insertAsync(horse);
      const insertedHorse = await Horses.findOneAsync(id);
      return insertedHorse;
    } else {
      const id = horse._id;
      delete horse._id;
      await Horses.updateAsync(id, { $set: horse });
      const updatedHorse = await Horses.findOneAsync(id);
      return updatedHorse;
    }
  },

  'derby.horses.duplicate': async (horseId: HorseId) => {
    const horseToDuplicate = await Horses.findOneAsync(horseId);
    if (!horseToDuplicate) return;
    const allNumbers = await Horses.find(
      { event: Events.currentId()! },
      { fields: { number: 1 } },
    ).mapAsync((h) => h.number);
    const { _id, getTotalStats, ...duplicatedHorse } = horseToDuplicate;
    let newNumber = horseToDuplicate.number;
    while (allNumbers.includes(newNumber)) {
      newNumber++;
    }
    duplicatedHorse.number = newNumber;
    await Horses.insertAsync(duplicatedHorse);
  },

  'derby.horses.delete': async (horseId: HorseId | HorseId[]) => {
    if (Array.isArray(horseId)) {
      await Horses.removeAsync({ _id: { $in: horseId } });
    } else {
      await Horses.removeAsync(horseId);
    }
  },

  'derby.horses.resetEvent': async (event_id: EventId) => {
    await Horses.updateAsync(
      { event: event_id },
      {
        $set: {
          stats: HorseStatsSchema.clean({}) as HorseStats,
        },
      },
      { multi: true },
    );
  },
});
