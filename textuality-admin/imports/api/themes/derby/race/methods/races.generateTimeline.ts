import Horses from '../../horses';
import Races from '../races';
import { generateTimelineWithResults } from '../timeline/generate-timeline';
import { RaceHorseResult, RaceId } from '/imports/schemas/derby/race';

const NUM_TIMELINES_TO_GENERATE = 10;

const getTopThreeRange = (results: RaceHorseResult[]) => {
  const sortedResults = results.sort((a, b) => a.time - b.time);
  return sortedResults[2].time - sortedResults[0].time;
};

export const raceGenerateTimeline = async (raceId: RaceId) => {
  const race = await Races.findOneAsync(raceId);
  if (!race) return;

  const horses = await Horses.find({ _id: { $in: race.horses } }).fetchAsync();

  const timelineResultCandidates = [];
  for (let i = 0; i < NUM_TIMELINES_TO_GENERATE; i++) {
    timelineResultCandidates.push(generateTimelineWithResults(race, horses));
  }

  // Find the timeline with the top three results that are closes together,
  // so that the race will be exciting
  let closestResults = Infinity;
  let closestResultsIdx = -1;
  for (let i = 0; i < timelineResultCandidates.length; i++) {
    const timelineResult = timelineResultCandidates[i];
    const topThreeRange = getTopThreeRange(timelineResult.results);
    if (topThreeRange < closestResults) {
      closestResults = topThreeRange;
      closestResultsIdx = i;
    }
  }
  const finalTimelineResults = timelineResultCandidates[closestResultsIdx];

  console.log('generated timeline with top3 range', closestResults);

  await Races.updateAsync(raceId, {
    $set: {
      timeline: finalTimelineResults.timeline,
      results: finalTimelineResults.results,
    },
  });
};
