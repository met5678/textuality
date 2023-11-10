import { Mongo } from 'meteor/mongo';

import { MissionSchema, Mission } from '/imports/schemas/mission';

interface MissionWithHelpers extends Mission {}

const Missions = new Mongo.Collection<Mission, MissionWithHelpers>('missions');

Missions.attachSchema(MissionSchema);

export default Missions;

export { MissionWithHelpers };
