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

  'fortune-opening',
  'fortune-open',
  'fortune-engaged',
  'fortune-closing',
] as const;
export type TellerStatus = (typeof TELLER_STATUS)[number];

export const TELLER_BUSY_STATUSES: TellerStatus[] = [
  'betting',
  'betting-impatient',
  'giving-stub-single',
  'giving-stub-multi',
  'timeout',
  'fortune-engaged',
];
export const TELLER_CLOSED_STATUSES: TellerStatus[] = [
  'closing',
  'break',
  'standup',
  'sitdown',
  'empty',

  'fortune-opening',
  'fortune-open',
  'fortune-engaged',
  'fortune-closing',
];
export const TELLER_AVAILABLE_STATUSES: TellerStatus[] = ['open'];

export const TELLER_FORTUNE_STATUSES: TellerStatus[] = [
  'fortune-opening',
  'fortune-open',
  'fortune-engaged',
  'fortune-closing',
];

export const TELLER_FORTUNE_AVAILABLE_STATUSES: TellerStatus[] = [
  'fortune-open',
];

export const TELLER_TRANSITION_STATUSES: TellerStatus[] = [
  'opening',
  'betting',
  'giving-stub-single',
  'giving-stub-multi',
  'standup',
  'sitdown',
] as const;

export const TELLER_TRANSITION_STATUS_TO_RESTING_STATUS: Record<
  TellerStatus,
  TellerStatus
> = {
  opening: 'open',
  open: 'open',
  betting: 'open',
  'betting-impatient': 'open',
  'giving-stub-single': 'open',
  'giving-stub-multi': 'open',
  timeout: 'open',
  closing: 'break',
  break: 'break',
  standup: 'empty',
  empty: 'empty',
  'fortune-opening': 'fortune-open',
  'fortune-open': 'fortune-open',
  'fortune-engaged': 'fortune-open',
  'fortune-closing': 'empty',
  sitdown: 'break',
};

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
  'fortune-opening': 10,
  'fortune-closing': 5,
};
