import { RouletteBet, RouletteBetSlot } from '/imports/schemas/rouletteBet';

const nums: number[] = [
  32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16,
  33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0,
];

const getSpecialBetSlotsForResult = (result: number): RouletteBetSlot[] => {
  const numIdx = typeof result === 'number' ? nums.indexOf(result) : -1;
  const resultColor =
    result === 0 ? 'green' : numIdx % 2 === 0 ? 'red' : 'black';

  const isEven = result % 2 === 0;

  const oddEvenSlot = isEven ? 'even' : 'odd';
  const colorSlot = resultColor !== 'green' ? resultColor : null;

  return [oddEvenSlot, colorSlot].filter(Boolean) as RouletteBetSlot[];
};

export default getSpecialBetSlotsForResult;
