const waitForSeconds = (seconds) => {
  return new Promise((callback) => {
    Meteor.setTimeout(callback, seconds * 1000);
  });
};

export default waitForSeconds;
