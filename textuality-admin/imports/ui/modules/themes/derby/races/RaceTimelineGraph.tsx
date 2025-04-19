import React from 'react';
import { Box } from '@mui/material';
import { LineChart, ChartsReferenceLine, ChartsAxisData } from '@mui/x-charts';
import { HorseWithHelpers } from '../../../../../api/themes/derby/horses/horses';
import {
  Race,
  RaceHorseResult,
  RaceTimeline,
} from '/imports/schemas/derby/race';
import { OVERRUN_DISTANCE_FURLONGS } from '/imports/api/themes/derby/race/timeline/generate-timeline';
import { Meteor } from 'meteor/meteor';

interface RaceTimelineGraphProps {
  race: Race;
  horses: HorseWithHelpers[];
  timeline: RaceTimeline;
  results: RaceHorseResult[];
}

export const RaceTimelineGraph = ({
  race,
  horses,
  timeline,
  results,
}: RaceTimelineGraphProps) => {
  const handleChartClick = (event: MouseEvent, data: null | ChartsAxisData) => {
    if (event.type === 'click' && data?.axisValue) {
      const xValue = Math.round(Number(data.axisValue));
      console.log('xValue', xValue);
      if (xValue >= 0) {
        Meteor.call('derby.races.seekToFrame', race._id, xValue);
      }
    }
  };

  // Prepare data for the chart
  const chartData = React.useMemo(() => {
    if (!timeline?.horses) return [];

    // Find the maximum frame number across all horses
    const maxFrame = Math.max(
      ...Object.values(timeline.horses).flatMap((keyframes) =>
        keyframes.map((kf) => kf.frame),
      ),
    );

    // Create series data for each horse
    const seriesData = Object.entries(timeline.horses)
      .filter(([horseId]) => results.some((r) => r.horse === horseId))
      .map(([horseId, keyframes]) => {
        const horse = horses.find((h) => h._id === horseId)!;

        // Create an array of positions for each frame up to maxFrame
        const positions = keyframes.map((kf) => kf.position);
        // Fill in remaining positions with last known position
        for (let i = keyframes.length; i <= maxFrame; i++) {
          positions.push(positions[positions.length - 1]);
        }

        return {
          horseId,
          label: `${horse.number} - ${horse.name} (${results.find(
            (r) => r.horse === horseId,
          )?.time}s)`,
          data: positions,
          color: horse.color,
        };
      });

    // Sort series based on race results order
    if (results?.length) {
      seriesData.sort((a, b) => {
        const aResult = results.find((r) => r.horse === a.horseId);
        const bResult = results.find((r) => r.horse === b.horseId);
        return (
          (aResult?.placement ?? Infinity) - (bResult?.placement ?? Infinity)
        );
      });
    }

    return seriesData;
  }, [timeline, horses, results]);

  if (chartData.length === 0) return null;

  return (
    <Box sx={{ height: 400 }}>
      <LineChart
        xAxis={[
          {
            data: Array.from({ length: chartData[0].data.length }, (_, i) => i),
            label: 'Time (seconds)',
          },
        ]}
        yAxis={[
          {
            label: 'Position',
            min: 0,
            max: race.furlong_length + OVERRUN_DISTANCE_FURLONGS,
          },
        ]}
        series={chartData.map((series) => ({
          label: series.label,
          data: series.data,
          color: series.color,
          showMark: false,
          curve: 'linear',
        }))}
        margin={{ top: 20, right: 200, bottom: 20, left: 20 }}
        slotProps={{
          legend: {
            direction: 'column',
            position: { vertical: 'middle', horizontal: 'right' },
            itemMarkHeight: 10,
            itemMarkWidth: 10,
          },
        }}
        onAxisClick={handleChartClick}
      >
        <ChartsReferenceLine
          y={race.furlong_length}
          label="Finish Line"
          labelAlign="start"
          lineStyle={{ stroke: 'red', strokeWidth: 2, strokeDasharray: '2 2' }}
          labelStyle={{ fill: 'red' }}
        />
        {timeline.effects.lightning?.map((strike) => (
          <ChartsReferenceLine
            key={strike.frame}
            x={strike.frame}
            label="⚡️"
            labelAlign="middle"
            lineStyle={{
              stroke: '#ffeb3b',
              strokeWidth: 1.5,
              strokeDasharray: '4 2',
            }}
          />
        ))}
        {timeline.effects.headwind?.map((gust) => (
          <ChartsReferenceLine
            key={gust.frame}
            x={gust.frame}
            label="💨"
            labelAlign="middle"
            lineStyle={{
              stroke: '#90caf9',
              strokeWidth: 1.5,
              strokeDasharray: '2 4',
            }}
          />
        ))}
        <ChartsReferenceLine
          x={timeline.current_frame}
          label="Current Frame"
          labelAlign="middle"
          lineStyle={{ stroke: '#000000', strokeWidth: 3 }}
          labelStyle={{ fill: '#000000', fontWeight: 'bold' }}
        />
      </LineChart>
    </Box>
  );
};
