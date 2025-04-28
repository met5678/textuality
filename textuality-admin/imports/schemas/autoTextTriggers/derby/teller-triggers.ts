type AutoTextConfig = {
  description: string;
  templateVars?: Record<string, string>;
};

const AUTOTEXT_TRIGGERS_DERBY_TELLER = {
  TELLER_REJECT_NO_RACES: {
    description:
      'Sent when player texts a @teller code when there are no races left. Should only happen after the last race.',
  },
  TELLER_REJECT_RACE_ACTIVE: {
    description:
      "Sent when player texts a @teller code when a race is active (and betting has closed). Doesn't matter whether the teller code exists or not.",
  },
  TELLER_REJECT_BETTING_NOT_YET_OPEN: {
    description:
      'Sent when player texts a @teller code when the last race (if any) is done, but betting is not yet open.',
    templateVars: {
      race_number: 'The number of the upcoming race.',
    },
  },
  TELLER_REJECT_NOT_EXIST: {
    description:
      "Sent when player texts a @teller code that doesn't exist and is not ever going to be a valid teller code.",
    templateVars: {
      teller_name: 'The teller code that was busy',
    },
  },
  TELLER_REJECT_NOT_HERE_NOW: {
    description:
      'Sent when player texts a @teller code that exists in the pool, but is not currently present.',
    templateVars: {
      teller_name: 'The teller code that was busy',
    },
  },
  TELLER_REJECT_BUSY_WITH_OTHER_PLAYER: {
    description:
      'Sent when player texts a @teller who is currently busy with another player. Most likely when two people text a teller at almost the same time.',
    templateVars: {
      teller_name: 'The teller code that was busy',
    },
  },
  TELLER_REJECT_OTHER_BET_IN_PROGRESS: {
    description:
      'Sent when player texts a @teller code that exists, but that player is in the middle of a bet with another teller.',
    templateVars: {
      old_teller_name:
        'The teller code that the player is currently betting with',
      new_teller_name: 'The teller code that the player tried to text',
    },
  },
  TELLER_REJECT_NOT_ENOUGH_MONEY: {
    description:
      "Sent when player texts a @teller code that exists, but the player doesn't have enough money to place a bet.",
    templateVars: {
      teller_name: 'The teller code that the player tried to bet with',
      min_wager: 'The minimum wager for the teller',
    },
  },

  TELLER_BET_TYPE: {
    description:
      'Player has successfully started a bet. This is the first message, asking them their bet type. The options will be shown in reply buttons and are "Win", "Trifecta", or "Cancel"',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
    },
  },
  TELLER_BET_HORSE_WIN: {
    description:
      'Player has selected "Win" as their bet type, and now needs to select the horse they want to bet on.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
    },
  },
  TELLER_BET_HORSE1_TRIFECTA: {
    description:
      'Player has selected "Trifecta" as their bet type, and now needs to select the horse they think will win 1st place.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
    },
  },
  TELLER_BET_HORSE2_TRIFECTA: {
    description:
      'Player has selected "Trifecta" as their bet type, and now needs to select the horse they think will win 2nd place.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
      horse1_name: 'The name of the horse the player picked for 1st',
      horse1_number: 'The number of the horse the player picked for 1st',
    },
  },
  TELLER_BET_HORSE3_TRIFECTA: {
    description:
      'Player has selected "Trifecta" as their bet type, and now needs to select the horse they think will win 3rd place.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
      horse1_name: 'The name of the horse the player picked for 1st',
      horse1_number: 'The number of the horse the player picked for 1st',
      horse2_name: 'The name of the horse the player picked for 2nd',
      horse2_number: 'The number of the horse the player picked for 2nd',
    },
  },
  TELLER_BET_WAGER: {
    description:
      'Player has selected their bet type and horses, and now needs to select how many stubs they want. Make sure to indicate that they have to press the button to pick an option, not just text one back.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
      bet_type: 'Win or Trifecta',
      min_bet: 'The cost of a single stub at this teller',
    },
  },
  TELLER_BET_DONE: {
    description: 'Player has placed their bet.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player is betting on',
      summary:
        'A summary of the bet, including the horses and the wager. Required',
      bet_type: 'Win or Trifecta',
      num_stubs: 'The number of stubs the player bet',
      wager: 'The total cost of the bet',
      odds: 'The odds of the bet at time of placement.',
    },
  },

  TELLER_ERROR_ALREADY_ANSWERED: {
    description:
      'Sent when player tries to re-answer a step they\'ve already completed. For example, hits "Win", then goes back and hits "Trifecta"',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
    },
  },

  TELLER_ERROR_ALREADY_PLACED: {
    description:
      'Sent when player tries to re-answer a step on an old bet they\'ve already placed. For example, hits "Win" on a bet they already finished placing.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
    },
  },

  TELLER_CANCEL_USER: {
    description:
      'Sent when the player explicitly cancels their bet during any of the steps.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
    },
  },

  TELLER_CANCEL_TIMEOUT: {
    description:
      'Sent when the player times out on any of the steps and their bet is auto-cancelled.',
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
    },
  },

  TELLER_CANCEL_RACE: {
    description:
      "Sent when the teller closes before the bet is completed, cutting off the player's bet.",
    templateVars: {
      teller_name: 'The teller code that the player is talking to',
      race_number: 'The number of the race that the player was betting on',
    },
  },
} as const satisfies Record<string, AutoTextConfig>;

export type AutoTextDerbyTrigger = keyof typeof AUTOTEXT_TRIGGERS_DERBY_TELLER;
