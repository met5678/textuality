import Races from '../races';
import Events from '/imports/api/events';

export const racesGetCurrent = async (
  fieldsSelector?: Record<string, number>,
) => {
  const races = await Races.find(
    {
      event: Events.currentIdOrThrow(),
      status: { $nin: ['inactive', 'future'] },
    },
    {
      sort: { time_race_starts_at: 1 },
      fields: fieldsSelector,
    },
  ).fetchAsync();

  return races[0];
};

export const racesGetCurrentSync = (
  fieldsSelector?: Record<string, number>,
) => {
  const races = Races.find(
    {
      event: Events.currentIdOrThrow(),
      status: { $nin: ['inactive', 'future'] },
    },
    {
      sort: { time_race_starts_at: 1 },
      fields: fieldsSelector,
    },
  ).fetch();

  return races[0];
};
