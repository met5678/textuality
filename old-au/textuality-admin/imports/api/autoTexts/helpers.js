import AutoTexts from './autoTexts';

AutoTexts.helpers({
  isNumeric() {
    return (
      this.trigger.startsWith('N_') ||
      this.trigger.endsWith('_N') ||
      this.trigger.includes('_N_')
    );
  }
});
