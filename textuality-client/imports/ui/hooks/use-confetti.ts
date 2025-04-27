import JSConfetti from 'js-confetti';
import { useEffect } from 'react';

const confetti = new JSConfetti();

const doConfetti = (emojis: string[]) => {
  confetti.addConfetti({
    confettiRadius: 10,
    confettiNumber: 100,
    emojis,
  });
};

const useConfetti = (fire: boolean, emojis = ['💰']) => {
  useEffect(() => {
    if (fire) doConfetti(emojis);
  }, [fire]);
};

export { useConfetti };
