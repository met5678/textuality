import { Meteor } from 'meteor/meteor';

import Missions from './missions';
import Events from '/imports/api/events';
import { EventId } from '/imports/schemas/event';
import { Mission, MissionId } from '/imports/schemas/mission';
import { OptionalId, UpdateRequiredId } from '/imports/utils/optional-id';

Meteor.methods({
  'missions.new': async (mission: OptionalId<Mission>) => {
    const id = await Missions.insertAsync(mission);
    return id;
  },

  'missions.update': async (mission: UpdateRequiredId<Mission>) => {
    await Missions.updateAsync(mission._id, { $set: mission });
    return await Missions.findOneAsync(mission._id);
  },

  'missions.upsert': async (mission: OptionalId<Mission>) => {
    if (!mission._id) {
      const id = await Missions.insertAsync(mission);
      const insertedMission = await Missions.findOneAsync(id);
      return insertedMission;
    } else {
      const id = mission._id;
      delete mission._id;
      await Missions.updateAsync(id, { $set: mission });
      const updatedMission = await Missions.findOneAsync(id);
      return updatedMission;
    }
  },

  'missions.duplicate': async (missionId: MissionId) => {
    const missionToDuplicate = await Missions.findOneAsync(missionId);
    if (!missionToDuplicate) return;
    const allNumbers = await Missions.find(
      { event: Events.currentId()! },
      { fields: { number: 1 } },
    ).mapAsync((m) => m.number);
    const { _id, ...duplicatedMission } = missionToDuplicate;
    let newNumber = missionToDuplicate.number;
    while (allNumbers.includes(newNumber)) {
      newNumber++;
    }
    duplicatedMission.number = newNumber;
    const id = await Missions.insertAsync(duplicatedMission);
    return await Missions.findOneAsync(id);
  },

  'missions.delete': async (missionId: MissionId | MissionId[]) => {
    if (Array.isArray(missionId)) {
      await Missions.removeAsync({ _id: { $in: missionId } });
    } else {
      await Missions.removeAsync(missionId);
    }
  },

  'missions.resetEvent': async () => {
    await Missions.updateAsync(
      { event: Events.currentId()! },
      {
        $set: { active: false },
        $unset: { timePreText: '', timeStart: '', timeEnd: '' },
      },
      { multi: true },
    );
  },

  'missions.copyFrom': async (
    destinationEventId: EventId,
    sourceEventId: EventId,
  ) => {
    await Missions.removeAsync({ event: destinationEventId });

    const sourceMissions = await Missions.find({
      event: sourceEventId,
    }).fetchAsync();
    for (const sourceMission of sourceMissions) {
      const { _id, ...destinationMission } = sourceMission;
      await Missions.insertAsync(destinationMission);
    }
  },
});
