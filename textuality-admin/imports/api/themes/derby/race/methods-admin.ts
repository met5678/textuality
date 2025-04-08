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
  'derby.races.new': (race: OptionalId<Race>) => {
    const id = Races.insert(race);
    return id;
  },

  'derby.races.update': (race: UpdateRequiredId<Race>) => {
    Races.update(race._id, { $set: race });
  },

  'derby.races.duplicate': (raceId: RaceId) => {
    const raceToDuplicate = Races.findOne(raceId);
    if (!raceToDuplicate) return;
    const newRace: OptionalId<Race> = {
      ...raceToDuplicate,
    };
    delete newRace._id;
    Races.insert(newRace);
  },

  'derby.races.delete': (raceId: RaceId) => {
    if (Array.isArray(raceId)) {
      Races.remove({ _id: { $in: raceId } });
    } else {
      Races.remove(raceId);
    }
  },

  'derby.races.updateStatus': (raceId: RaceId, status: RaceStatus) => {
    Races.update(raceId, {
      $set: { status },
    });
  },

  'derby.races.updateTimeline': (raceId: RaceId, timeline: RaceTimeline) => {
    Races.update(raceId, {
      $set: { timeline },
    });
  },

  'derby.races.resetEvent': (eventId: EventId) => {
    Races.update(
      { event: eventId },
      {
        $set: {
          status: 'future',
          timeline: {
            horses: {},
            effects: {},
            current_frame: 0,
          },
        },
      },
      { multi: true },
    );
  },

  'derby.races.copyFrom': (
    destinationEventId: EventId,
    sourceEventId: EventId,
  ) => {
    Races.remove({ event: destinationEventId });
    const sourceRaces = Races.find({ event: sourceEventId }).fetch();
    sourceRaces.forEach((sourceRace) => {
      const newRace: OptionalId<Race> = {
        ...sourceRace,
        event: destinationEventId,
      };
      delete newRace._id;
      Races.insert(newRace);
    });
  },
});
