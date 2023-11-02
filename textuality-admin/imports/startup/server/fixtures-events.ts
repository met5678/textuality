import Events from '/imports/api/events';

if (!Events.findOne()) {
  Events.insert({
    name: 'Clue',
    phoneNumber: '12029158015',
    active: false,
    theme: 'clue',
  });

  Events.insert({
    name: 'Casino',
    phoneNumber: '12029158015',
    active: true,
    theme: 'casino',
  });
}
