export const FORTUNE_TELLER_NAMES = [
  'Zyrah',
  'Misty',
  'Sable',
  'Hexie',
  'Luna',
  'Sorah',
  'Eerie',
  'Karma',
  'Tara',
  'Lenu',
];

let lastSelectedIdx = Math.floor(Math.random() * FORTUNE_TELLER_NAMES.length);

export const fortuneTellerGetCode = async () => {
  const name = FORTUNE_TELLER_NAMES[lastSelectedIdx];
  lastSelectedIdx = (lastSelectedIdx + 1) % FORTUNE_TELLER_NAMES.length;
  return name;
};

export const fortuneTellerCodeExists = (code: string) => {
  return FORTUNE_TELLER_NAMES.includes(code);
};
