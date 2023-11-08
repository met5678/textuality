import SlotMachines from './slotMachines';

SlotMachines.helpers({
  getExpectedReturn() {
    if (!Array.isArray(this.odds)) return 0;
    return (
      Math.round(
        this.odds.reduce((acc, odd) => {
          return acc + odd.payout_multiplier * odd.odds;
        }, 0) * 100,
      ) / 100
    );
  },

  getWinPercent() {
    if (!Array.isArray(this.odds)) return 0;
    return (
      this.odds.reduce((acc, odd) => {
        return acc + odd.odds;
      }, 0) * 100
    );
  },
});
