import { Meteor } from 'meteor/meteor';

import Powerups from './powerups';
import Events from '/imports/api/events';
import { Powerup, PowerupId } from '/imports/schemas/derby/powerup';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';
import { EventId } from '/imports/schemas/event';

Meteor.methods({
  'derby.powerups.new': async (powerup: OptionalId<Powerup>) => {
    const id = await Powerups.insertAsync(powerup);
    return id;
  },

  'derby.powerups.update': async (powerup: UpdateRequiredId<Powerup>) => {
    await Powerups.updateAsync(powerup._id, { $set: powerup });
    return await Powerups.findOneAsync(powerup._id);
  },

  'derby.powerups.upsert': async (powerup: OptionalId<Powerup>) => {
    if (!powerup._id) {
      const id = await Powerups.insertAsync(powerup);
      const insertedPowerup = await Powerups.findOneAsync(id);
      return insertedPowerup;
    } else {
      const id = powerup._id;
      delete powerup._id;
      await Powerups.updateAsync(id, { $set: powerup });
      const updatedPowerup = await Powerups.findOneAsync(id);
      return updatedPowerup;
    }
  },

  'derby.powerups.delete': async (powerupId: PowerupId | PowerupId[]) => {
    if (Array.isArray(powerupId)) {
      await Powerups.removeAsync({ _id: { $in: powerupId } });
    } else {
      await Powerups.removeAsync(powerupId);
    }
  },

  'derby.powerups.resetEvent': async (event_id: EventId) => {
    await Powerups.removeAsync({ event: event_id });
  },
});
