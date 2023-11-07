interface AchievementConfig {
  useString?: boolean;
  useNumber?: boolean;
  stringField?: string;
  numberField?: string;
}

const achievementsConfig: Record<string, AchievementConfig> = {
  CHECKPOINT_LOCATION_COMPLETE: {
    useString: true,
    stringField: 'Location',
  },
  CHECKPOINT_LOCATION_FOUND_N: {
    useString: true,
    stringField: 'Location',
    useNumber: true,
    numberField: 'N',
  },
  CHECKPOINT_GROUP_COMPLETE: {
    useString: true,
    stringField: 'Group',
  },
  CHECKPOINT_GROUP_FOUND_N: {
    useString: true,
    stringField: 'Group',
    useNumber: true,
    numberField: 'N',
  },
};

export default achievementsConfig;
