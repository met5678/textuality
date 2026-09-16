import Events from '../../events';
import { giveMissionRewardCasino } from './casino/give-mission-reward-casino';
import { EventTheme } from '/imports/schemas/event';
import { MissionId } from '/imports/schemas/mission';
import { PlayerId } from '/imports/schemas/player';

export type GiveMissionRewardArgs = {
  playerA: PlayerId;
  playerB: PlayerId;
  missionId: MissionId;
};

type GiveMissionRewardFn = (
  args: GiveMissionRewardArgs,
) => Promise<void> | void;

const MISSION_REWARDS_BY_THEME: Record<EventTheme, GiveMissionRewardFn | null> =
  {
    casino: giveMissionRewardCasino,
    clue: null,
    derby: null,
  };

export const giveMissionReward = async (rewardArgs: GiveMissionRewardArgs) => {
  const event = await Events.currentOrThrowAsync();

  if (MISSION_REWARDS_BY_THEME[event.theme]) {
    MISSION_REWARDS_BY_THEME[event.theme]?.(rewardArgs);
  }
};
