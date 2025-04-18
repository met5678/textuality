import Horses from './horses';

Horses.helpers({
  getTotalStats() {
    const stats = this.stats;
    return (
      stats.speed +
      stats.endurance +
      stats.luck +
      stats.traction +
      stats.distractibility
    );
  },
});
