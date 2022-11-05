let lastTimeout = null;

const waitForSeconds = (seconds) => {
  return new Promise((callback) => {
    lastTimeout = Meteor.setTimeout(callback, seconds * 1000);
  });
};

const cancelTimeout = () => {
  if (lastTimeout) Meteor.clearTimeout(lastTimeout);
};

export default waitForSeconds;

export { cancelTimeout };
