import Globals from 'api/globals';

if (!Globals.findOne()) {
  Globals.insert({
    useFakeTime: false,
    fakeTime: new Date(2019, 2, 1, 0, 0, 0),
    season: '11'
  });
}
