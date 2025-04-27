export const TELLER_STATUS = [
  'opening',
  'open',
  'betting',
  'betting-impatient',
  'timeout',
  'giving-stub-single',
  'giving-stub-multi',
  'closing',
  'break',
  'standup',
  'empty',
  'sitdown',
] as const;
export type TellerStatus = (typeof TELLER_STATUS)[number];

export const TELLER_BUSY_STATUSES: TellerStatus[] = [
  'opening',
  'betting',
  'betting-impatient',
  'giving-stub-single',
  'giving-stub-multi',
  'timeout',
];
export const TELLER_CLOSED_STATUSES: TellerStatus[] = [
  'closing',
  'break',
  'standup',
  'sitdown',
  'empty',
];
export const TELLER_AVAILABLE_STATUSES: TellerStatus[] = ['open'];

export const TELLER_OPEN_STATUSES = [
  ...TELLER_AVAILABLE_STATUSES,
  ...TELLER_BUSY_STATUSES,
];

export const TELLER_VIDEO_LENGTHS: Partial<Record<TellerStatus, number>> = {
  opening: 5,
  timeout: 3,
  'giving-stub-single': 4,
  'giving-stub-multi': 4,
  closing: 5,
  standup: 5,
  sitdown: 10,
};
