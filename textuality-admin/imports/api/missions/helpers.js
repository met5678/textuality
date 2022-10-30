import Missions from './missions';

Missions.active = () => {
  return Missions.findOne({ active: true });
};

Missions.helpers({
  // active() {
  //   const now = new Date();
  //   return now >= this.timeStart && now < this.timeEnd;
  // }
});
