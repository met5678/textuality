import SimpleSchema from 'simpl-schema';

import Events from 'api/events';
import Rounds from 'api/rounds';
import ClueSchema from './clue';

const clueRewardSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: () => Events.allIds(),
  },
  round: {
    type: String,
    allowedValues: () => Rounds.allIds(),
  },
  clueId: String,
  clueName: String,
  clueShortName: String,
  clueType: {
    type: String,
    allowedValues: ClueSchema.get('type', 'allowedValues'),
  },
  time: Date,
  player: String,
  alias: String,
  avatar: String,
  totalCluesFound: SimpleSchema.Integer,
});

export default clueRewardSchema;
