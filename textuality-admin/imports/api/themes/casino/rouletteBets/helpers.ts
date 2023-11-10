import RouletteBets from './rouletteBets';

RouletteBets.helpers({
  isNumberBet(): boolean {
    try {
      const num = parseInt(String(this.bet_slot));
      return num >= 0 && num <= 36;
    } catch (e) {
      return false;
    }
  },

  isColorBet() {
    return this.bet_slot === 'red' || this.bet_slot === 'black';
  },

  isOddEvenBet() {
    return this.bet_slot === 'even' || this.bet_slot === 'odd';
  },

  isSpecialBet() {
    return this.isColorBet() || this.isOddEvenBet();
  },
});
