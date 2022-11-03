import { Mongo } from 'meteor/mongo';

import ClueRewardSchema from 'schemas/clueReward';

const ClueRewards = new Mongo.Collection('clueRewards');

ClueRewards.attachSchema(ClueRewardSchema);

export default ClueRewards;
