import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

const reactiveDate = new ReactiveVar(new Date());
let dateInterval = null;

Meteor.startup(() => {
  dateInterval = Meteor.setInterval(() => {
    reactiveDate.set(new Date());
  }, 1000);
});

export default reactiveDate;
