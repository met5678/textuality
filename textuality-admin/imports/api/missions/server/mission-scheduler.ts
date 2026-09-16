import { Meteor } from 'meteor/meteor';
import Events from '../../events';
import Missions from '../missions';
import { missionEnd } from '../methods/missions.end';

const scheduleMissions = async () => {
  let isRunningTick = false;

  const tickMissions = async () => {
    const eventMissions = await Missions.find({
      event: await Events.currentIdOrThrowAsync(),
      active: true,
      timeStart: { $exists: true },
    }).fetchAsync();

    for (const mission of eventMissions) {
      if (
        mission.timeStart &&
        Date.now() > mission.timeStart.getTime() + mission.minutes * 60 * 1000
      ) {
        await missionEnd(mission._id);
      }
    }
  };

  Meteor.setInterval(async () => {
    if (!isRunningTick) {
      isRunningTick = true;
      try {
        await tickMissions();
      } catch (error) {
        console.error('Mission scheduler tick failed', error);
      } finally {
        isRunningTick = false;
      }
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
