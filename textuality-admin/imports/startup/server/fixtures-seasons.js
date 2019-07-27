import Seasons from 'api/seasons';

if (!Seasons.findOne()) {
  Seasons.insert({
    name: 'dev',
    dateSignupsOpen: new Date('January 1, 2019 20:00:00'),
    dateSignupsClose: new Date('January 10, 2019 20:00:00'),
    enabled: false
  });
  Seasons.insert({
    name: '11',
    dateSignupsOpen: new Date('February 15, 2019 20:00:00'),
    dateSignupsClose: new Date('March 7, 2019 20:00:00'),
    enabled: true
  });
}
