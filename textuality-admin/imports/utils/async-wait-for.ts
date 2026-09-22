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

export const waitForSecondsCancellable = (
  seconds: number,
): [Promise<void>, () => void] => {
  let timeoutId: number | null = null;

  const promise = new Promise<void>((resolve) => {
    timeoutId = Meteor.setTimeout(resolve, seconds * 1000);
  });

  const cancel = () => {
    if (timeoutId !== null) {
      Meteor.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return [promise, cancel];
};
