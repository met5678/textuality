import { Meteor } from 'meteor/meteor';
import Events from '../../events';
import Missions from '../missions';
import { missionStart } from '../methods/missions.start';
import { missionEnd } from '../methods/missions.end';
import { DateTime } from 'luxon';

const scheduleMissions = async () => {
  let isRunningTick = false;

  const tickMissions = async () => {
    const eventMissions = await Missions.find({
      event: await Events.currentIdOrThrowAsync(),
    }).fetchAsync();

    for (const mission of eventMissions) {
      const timeStart = mission.timeStart;
      const timeEnd = mission.timeStart
        ? DateTime.fromJSDate(mission.timeStart)
            .plus({ minutes: mission.minutes })
            .toJSDate()
        : undefined;

      if (!timeStart) {
        return;
      }
      // Mission hasn't started yet
      if (new Date() < timeStart) {
        if (mission.active) {
          // Probably shouldn't be here, but reset misssion and pairings
        }
        return;
      }

      if (!timeEnd) {
        return;
      }
      // Mission is active
      if (new Date() < timeEnd) {
        if (!mission.active) {
          await missionStart(mission._id);
        }
      }
      // Mission is in the past
      if (new Date() >= timeEnd) {
        if (mission.active) {
          await missionEnd(mission._id);
        }
      }
    }
  };

  Meteor.setInterval(async () => {
    if (!isRunningTick) {
      isRunningTick = true;
      await tickMissions();
      isRunningTick = false;
    }
  }, 1000);
};

if (
  Meteor.isServer &&
  // Prevent running the scheduler when we're doing local dev on prod data
  // since the prod server will be trying to run it simultaneously
  (process.env.DB_ENV === 'local' || Meteor.isProduction)
) {
  Meteor.startup(() => {
    scheduleMissions();
  });
}
