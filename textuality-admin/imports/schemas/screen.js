import SimpleSchema from 'simpl-schema';

const ScreenSchema = new SimpleSchema({
  path: String,
  template: String,
  settings: {
    type: Object,
    blackbox: true
  }
});

// Maybe add 'theme'

export default ScreenSchema;
