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
  'races.new': (race: OptionalId<Race>) => {
    const id = Races.insert(race);
    return id;
  },

  'races.update': (race: UpdateRequiredId<Race>) => {
    Races.update(race._id, { $set: race });
  },

  'races.duplicate': (raceId: RaceId) => {
    const raceToDuplicate = Races.findOne(raceId);
    if (!raceToDuplicate) return;
    const newRace: OptionalId<Race> = {
      ...raceToDuplicate,
    };
    delete newRace._id;
    Races.insert(newRace);
  },

  'races.delete': (raceId: RaceId) => {
    if (Array.isArray(raceId)) {
      Races.remove({ _id: { $in: raceId } });
    } else {
      Races.remove(raceId);
    }
  },

  'races.updateStatus': (raceId: RaceId, status: RaceStatus) => {
    Races.update(raceId, {
      $set: { status },
    });
  },

  'races.updateTimeline': (raceId: RaceId, timeline: RaceTimeline) => {
    Races.update(raceId, {
      $set: { timeline },
    });
  },

  'races.resetEvent': (eventId: EventId) => {
    Races.update(
      { event: eventId },
      {
        $set: {
          status: 'future',
          timeline: {
            horses: {},
            events: {},
            current_frame: 0,
          },
        },
      },
      { multi: true },
    );
  },

  'races.copyFrom': (destinationEventId: EventId, sourceEventId: EventId) => {
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
