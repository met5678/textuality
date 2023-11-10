type UnlockStatus = 'NONE' | 'CORRECT' | 'COMPLETE';

const doArraysMatch = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length != arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }

  return true;
};

const checkSlotSequence = (
  unlockSequence: string[],
  playerSequence: string[],
): UnlockStatus => {
  if (unlockSequence.length == 0 || playerSequence.length == 0) {
    return 'NONE';
  }
  let unlockStatus: UnlockStatus = 'NONE';

  for (let u = 1; u <= unlockSequence.length; u++) {
    if (u > playerSequence.length) break;

    const match = doArraysMatch(
      unlockSequence.slice(0, u),
      playerSequence.slice(playerSequence.length - u),
    );
    if (!match) continue;

    unlockStatus = 'CORRECT';
    if (u == unlockSequence.length) {
      unlockStatus = 'COMPLETE';
    }
  }

  return unlockStatus;
};

export default checkSlotSequence;
