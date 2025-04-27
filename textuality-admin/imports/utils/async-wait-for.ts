import { Meteor } from 'meteor/meteor';

let lastTimeout: number | null = null;

export const waitForSeconds = (seconds: number) => {
  return new Promise((resolve) => {
    lastTimeout = Meteor.setTimeout(resolve, seconds * 1000);
  });
};

export const cancelWaitForSeconds = () => {
  if (lastTimeout) Meteor.clearTimeout(lastTimeout);
};
