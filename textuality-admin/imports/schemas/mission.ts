import SimpleSchema from 'simpl-schema';

import Events from '/imports/api/events';

const MissionSchema = new SimpleSchema({
  event: {
    type: String,
    allowedValues: Events.allIds,
  },
  name: String,
  number: SimpleSchema.Integer,
  active: {
    type: Boolean,
    defaultValue: false,
  },
  minutes: {
    type: SimpleSchema.Integer,
    defaultValue: 10,
  },
  timePreText: {
    type: Date,
    optional: true,
  },
  timeStart: {
    type: Date,
    optional: true,
  },
  timeEnd: {
    type: Date,
    optional: true,
  },
  missionPreText: {
    type: String,
    optional: true,
  },
  missionPlayerAText: {
    type: String,
    optional: true,
  },
  missionPlayerBText: {
    type: String,
    optional: true,
  },
  missionSuccessText: {
    type: String,
    optional: true,
  },
  missionFailText: {
    type: String,
    optional: true,
  },
});

interface Mission {
  _id?: string;
  event: string;
  name: string;
  number: number;
  active: boolean;
  minutes: number;
  timePreText?: Date;
  timeStart?: Date;
  timeEnd?: Date;
  missionPreText?: string;
  missionPlayerAText?: string;
  missionPlayerBText?: string;
  missionSuccessText?: string;
  missionFailText?: string;
}

export default MissionSchema;
export { Mission, MissionSchema };
