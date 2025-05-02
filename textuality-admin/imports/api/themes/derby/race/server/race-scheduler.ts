import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { DateTime } from 'luxon';

import Races, { RaceWithHelpers } from '../races';
import Events from '/imports/api/events';
import reactiveDate from '/imports/utils/reactive-date';
import race, { RaceStatus } from '/imports/schemas/derby/race';
import { raceStartIntro } from '../methods/races.startIntro';
import { raceOpenBets } from '../methods/races.openBets';
import { raceStartRace } from '../methods/races.startRace';
import { raceDeactivate } from '../methods/races.deactivate';
import { raceStartResults } from '../methods/races.startResults';
import { raceStartPreBets } from '../methods/races.startPreBets';
import {
  generateTimelineWithResults,
  MAX_TIMELINE_SECONDS,
} from '../timeline/generate-timeline';
import { racesGetCurrentSync } from '../methods/races.getCurrent';
import Missions from '/imports/api/missions';
import { raceGenerateTimeline } from '../methods/races.generateTimeline';

const INTRO_DURATION_SECONDS = 30;
const RACE_MAX_DURATION_SECONDS = 200;
const POST_RACE_PAUSE_SECONDS = 15;
const RESULTS_MAX_DURATION_SECONDS = MAX_TIMELINE_SECONDS;

const getRaceDurationSeconds = (race: RaceWithHelpers) => {
  if (!race.results || Object.keys(race.results).length === 0) {
    return RACE_MAX_DURATION_SECONDS;
  }

  const lastHorseFinishTime = Math.max(
    ...race.results.map((result) => result.time),
  );

  return lastHorseFinishTime + POST_RACE_PAUSE_SECONDS;
};

const getResultsDurationSeconds = (race: RaceWithHelpers) => {
  // TODO: Iterate through bet winner, figure out how long
  // it will take to show them all

  return RESULTS_MAX_DURATION_SECONDS;
};

const changeRaceStatus = (race: RaceWithHelpers, status: RaceStatus) => {
  switch (status) {
    case 'pre-bets':
      raceStartPreBets(race._id);
      break;
    case 'bets-open':
      raceOpenBets(race._id);
      break;
    case 'intro':
      raceStartIntro(race._id);
      break;
    case 'active':
      raceStartRace(race._id);
      break;
    case 'results':
      raceStartResults(race._id);
      break;
    case 'inactive':
      raceDeactivate(race._id, false);
      break;
    case 'future':
      raceDeactivate(race._id, true);
      break;
  }
};

const getExpectedStatus = (race: RaceWithHelpers, now: Date): RaceStatus => {
  if (now <= race.time_bets_start_at) return 'pre-bets';
  if (now <= race.time_race_starts_at) return 'bets-open';

  const introStartTime = DateTime.fromJSDate(race.time_race_starts_at!);
  const raceStartTime = introStartTime.plus({
    seconds: INTRO_DURATION_SECONDS,
  });
  const raceEndTime = raceStartTime.plus({
    seconds: getRaceDurationSeconds(race) + POST_RACE_PAUSE_SECONDS,
  });
  const resultsEndTime = raceEndTime.plus({
    seconds: getResultsDurationSeconds(race),
  });

  if (now <= raceStartTime.toJSDate()) return 'intro';

  if (now <= raceEndTime.toJSDate()) return 'active';

  if (now <= resultsEndTime.toJSDate()) return 'results';

  return 'inactive';
};

let scheduleRacesHandle: Meteor.LiveQueryHandle;
const scheduleRaces = () => {
  if (scheduleRacesHandle) {
    scheduleRacesHandle.stop();
  }

  scheduleRacesHandle = Tracker.autorun(() => {
    const now = reactiveDate.get();

    const eventRaces = Races.find(
      {
        event: Events.currentId(),
        scheduled: true,
      },
      {
        sort: { time_race_starts_at: 1 },
      },
    ).fetch();

    const unscheduledRaces = Races.find({
      event: Events.currentId(),
      scheduled: false,
      status: { $nin: ['inactive'] },
    }).fetch();

    let foundCurrentRace = unscheduledRaces.length > 0;
    for (const race of eventRaces) {
      const expectedStatus = foundCurrentRace
        ? 'future'
        : getExpectedStatus(race, now);

      if (race.status !== expectedStatus) {
        changeRaceStatus(race, expectedStatus);
      }

      if (expectedStatus !== 'inactive') {
        foundCurrentRace = true;
      }
    }
  });
};

let scheduleRaceMissionsHandle: Meteor.LiveQueryHandle;
const scheduleRaceMissions = () => {
  if (scheduleRaceMissionsHandle) {
    scheduleRaceMissionsHandle.stop();
  }

  let startingMission = false;
  scheduleRaceMissionsHandle = Tracker.autorun(async () => {
    const now = reactiveDate.get();

    const currentRace = racesGetCurrentSync();
    if (!currentRace || !currentRace.linked_mission) return;

    const mission = Missions.findOne({
      _id: currentRace.linked_mission,
    });

    if (!mission) return;
    if (mission.active) {
      if (
        currentRace.status !== 'pre-bets' ||
        (mission.timeEnd && now > mission.timeEnd)
      ) {
        Meteor.callAsync('missions.end', { missionId: mission._id });
      }
      return;
    }
    if (mission.timeStart && now > mission.timeStart) {
      return;
    }

    if (startingMission) {
      console.log('mission already starting, not starting again');
      return;
    }

    // If we are past the bets start tine minus the mission minutes duration, start the mission
    const betsStartTime = DateTime.fromJSDate(currentRace.time_bets_start_at!);
    const missionStartTime = betsStartTime.minus({
      minutes: mission.minutes,
    });

    if (now > missionStartTime.toJSDate()) {
      startingMission = true;
      await raceGenerateTimeline(currentRace._id);
      console.log('starting mission');
      await Meteor.callAsync('missions.start', { missionId: mission._id });
      startingMission = false;
    }
  });
};

if (Meteor.isServer /* && Meteor.isProduction*/) {
  Meteor.startup(() => {
    scheduleRaces();
    scheduleRaceMissions();
  });
}
