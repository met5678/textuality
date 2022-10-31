import React from 'react';

import VizTimeline from 'react-visjs-timeline';
import { DataView, DataSet } from 'vis';

const Timeline = ({
  items,
  groups,
  customTimes,
  timechangedHandler,
  start,
  end,
  customOrder
}) => {
  return (
    <VizTimeline
      timechangedHandler={e => {
        if (typeof timechangedHandler === 'function') {
          timechangedHandler(e);
        }
      }}
      options={{
        zoomMax: 7776000000,
        zoomMin: 60000,
        order: customOrder,
        start,
        end
      }}
      items={items}
      groups={groups}
      customTimes={customTimes}
    />
  );
};

export default Timeline;
