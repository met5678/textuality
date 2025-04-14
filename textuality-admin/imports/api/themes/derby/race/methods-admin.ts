import { Meteor } from 'meteor/meteor';

import Races from './races';
import {
  Race,
  RaceId,
  RaceTimeline,
  RaceStatus,
} from '/imports/schemas/derby/race';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';
import { EventId } from '/imports/schemas/event';

Meteor.methods({
  'derby.races.new': async (race: OptionalId<Race>) => {
    const id = await Races.insertAsync(race);
    return id;
  },

  'derby.races.update': async (race: UpdateRequiredId<Race>) => {
    await Races.updateAsync(race._id, { $set: race });
  },

  'derby.races.duplicate': async (raceId: RaceId) => {
    const raceToDuplicate = await Races.findOneAsync(raceId);
    if (!raceToDuplicate) return;
    const newRace: OptionalId<Race> = {
      ...raceToDuplicate,
    };
    delete newRace._id;
    await Races.insertAsync(newRace);
  },

  'derby.races.delete': async (raceId: RaceId) => {
    if (Array.isArray(raceId)) {
      await Races.removeAsync({ _id: { $in: raceId } });
    } else {
      await Races.removeAsync(raceId);
    }
  },

  'derby.races.updateStatus': async (raceId: RaceId, status: RaceStatus) => {
    await Races.updateAsync(raceId, {
      $set: { status },
    });
  },

  'derby.races.updateTimeline': async (
    raceId: RaceId,
    timeline: RaceTimeline,
  ) => {
    await Races.updateAsync(raceId, {
      $set: { timeline },
    });
  },

  'derby.races.resetEvent': async (eventId: EventId) => {
    await Races.updateAsync(
      { event: eventId },
      {
        $set: {
          status: 'future',
          odds: [],
          timeline: {
            horses: {},
            effects: {},
            current_frame: 0,
            is_playing: false,
          },
        },
      },
      { multi: true },
    );
  },

  'derby.races.copyFrom': async (
    destinationEventId: EventId,
    sourceEventId: EventId,
  ) => {
    await Races.removeAsync({ event: destinationEventId });
    const sourceRaces = await Races.find({ event: sourceEventId }).fetchAsync();

    for (const sourceRace of sourceRaces) {
      const newRace: OptionalId<Race> = {
        ...sourceRace,
        event: destinationEventId,
      };
      delete newRace._id;
      await Races.insertAsync(newRace);
    }
  },
});
