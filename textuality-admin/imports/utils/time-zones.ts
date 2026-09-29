import { DateTime } from 'luxon';

const US_TIME_ZONES = [
  'America/Adak',
  'America/Anchorage',
  'America/Boise',
  'America/Chicago',
  'America/Denver',
  'America/Detroit',
  'America/Indiana/Indianapolis',
  'America/Indiana/Knox',
  'America/Indiana/Marengo',
  'America/Indiana/Petersburg',
  'America/Indiana/Tell_City',
  'America/Indiana/Vevay',
  'America/Indiana/Vincennes',
  'America/Indiana/Winamac',
  'America/Juneau',
  'America/Kentucky/Louisville',
  'America/Kentucky/Monticello',
  'America/Los_Angeles',
  'America/Menominee',
  'America/Metlakatla',
  'America/New_York',
  'America/Nome',
  'America/North_Dakota/Beulah',
  'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem',
  'America/Phoenix',
  'America/Sitka',
  'America/Yakutat',
  'Pacific/Honolulu',
];

export const getTimeZoneOptions = (): string[] => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return US_TIME_ZONES;
  }
};

export const formatTimeZoneOffset = (timeZone: string): string => {
  const offsetMinutes = DateTime.now().setZone(timeZone).offset;
  const sign = offsetMinutes > 0 ? '+' : offsetMinutes < 0 ? '-' : '';
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;

  return minutes
    ? `${sign}${hours}:${minutes.toString().padStart(2, '0')}`
    : `${sign}${hours}`;
};
