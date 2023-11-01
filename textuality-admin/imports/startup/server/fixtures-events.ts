import Events from '/imports/api/events';

if (!Events.findOne()) {
  // Events.insert({
  //   name: 'Achievement Unlocked',
  //   phoneNumber: '12029158015',
  //   active: false,
  //   theme: 'achievement-unlocked'
  // });

  Events.insert({
    name: 'Clue',
    phoneNumber: '12029158015',
    active: false,
    theme: 'clue'
  });

  Events.insert({
    name: 'Achievement Unlocked',
    phoneNumber: '12029158015',
    active: true,
    theme: 'casino'
  });
}