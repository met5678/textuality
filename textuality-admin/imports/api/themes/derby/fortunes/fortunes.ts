import { Mongo } from 'meteor/mongo';
import { FortuneSchema } from '/imports/schemas/derby/fortune';
import { Fortune } from '/imports/schemas/derby/fortune';

interface FortuneWithHelpers extends Fortune {}

const Fortunes = new Mongo.Collection<Fortune, FortuneWithHelpers>(
  'derby_fortunes',
);

Fortunes.attachSchema(FortuneSchema);

export default Fortunes;
export { FortuneWithHelpers };
