import generateHackerClue from '../hacker-clues/generate-hacker-clue';
import Roulettes from '../roulettes';
import Players from '/imports/api/players';
import { MissionId } from '/imports/schemas/mission';
import { PlayerId } from '/imports/schemas/player';

type SendHackerClueArgs = {
  missionId: MissionId;
  playerId: PlayerId;
};

export const rouletteSendHackerClue = async ({
  missionId,
  playerId,
}: SendHackerClueArgs) => {
  const roulette = await Roulettes.findOneAsync({
    linked_mission: missionId,
  });

  const player = await Players.findOneAsync(playerId);

  if (!roulette || !player) return;
  if (!roulette.result) return;

  generateHackerClue({ roulette, player });
};
