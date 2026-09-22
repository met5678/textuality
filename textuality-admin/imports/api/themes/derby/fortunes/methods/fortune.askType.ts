import { sendAutoText } from '/imports/api/autoTexts/methods/autoTexts.send';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { TellerWithHelpers } from '../../tellers/tellers';
import { FortuneWithHelpers } from '../fortunes';

type FortuneAskTypeArgs = {
  fortune: FortuneWithHelpers;
  player: PlayerWithHelpers;
  teller: TellerWithHelpers;
};

const FORTUNE_TELLER_ADVICE_TYPE_OPTIONS = [
  {
    'stat-top': 'Good Advice',
    'stat-bottom': 'Bad Advice',
    horse: 'Unique Advice',
  },
  {
    'stat-top': 'Salient Wisdom',
    'stat-bottom': 'Shitty Words',
    horse: 'Solo Wiles',
  },
];

const getAdviceTypeOptions = (fortune: FortuneWithHelpers) => {
  const adviceTypeOptions =
    FORTUNE_TELLER_ADVICE_TYPE_OPTIONS[
      Math.floor(Math.random() * FORTUNE_TELLER_ADVICE_TYPE_OPTIONS.length)
    ];

  return [
    {
      label: adviceTypeOptions['stat-top'],
      value: `fortune/${fortune._id}/stat-top`,
    },
    {
      label: adviceTypeOptions['stat-bottom'],
      value: `fortune/${fortune._id}/stat-bottom`,
    },
    {
      label: adviceTypeOptions['horse'],
      value: `fortune/${fortune._id}/horse`,
    },
  ];
};

export const fortuneAskType = async ({
  fortune,
  player,
  teller,
}: FortuneAskTypeArgs) => {
  sendAutoText({
    trigger: 'FORTUNE_TELLER_ADVICE_TYPE',
    playerId: player._id,
    templateVars: {
      teller_name: fortune.teller_text_code,
      cost: teller.min_wager,
    },
    interactivePayload: {
      type: 'buttons',
      options: getAdviceTypeOptions(fortune),
    },
  });
};
