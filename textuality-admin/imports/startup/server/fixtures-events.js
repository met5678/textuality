import Events from 'api/events';

if (!Events.findOne()) {
  Events.insert({
    name: 'Achievement Unlocked',
    phone_number: '12029158015',
    active: true
  });
}
