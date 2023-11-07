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
    max: 150,
    optional: true,
  },
  missionSuccessText: {
    type: String,
    max: 150,
    optional: true,
  },
  missionFailText: {
    type: String,
    max: 150,
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
  missionSuccessText?: string;
  missionFailText?: string;
}

export default MissionSchema;
export { Mission, MissionSchema };
