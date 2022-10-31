import { Mongo } from 'meteor/mongo';

import MissionSchema from 'schemas/mission';

const Missions = new Mongo.Collection('missions');

Missions.attachSchema(MissionSchema);

export default Missions;
