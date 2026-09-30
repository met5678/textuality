import JSConfetti from 'js-confetti';
import { useEffect } from 'react';

import { useConfetti as useConfettiSVG } from 'use-confetti-svg';

const confetti = new JSConfetti();

const doConfetti = (emojis: string[]) => {
  confetti.addConfetti({
    confettiRadius: 10,
    confettiNumber: 100,
    emojis,
  });
};

const useConfetti = (fire: boolean, emojis = ['💰']) => {
  const { runAnimation } = useConfettiSVG({
    duration: 6000,
    speed: 75,
    images: [
      {
        src: '/images/emojis/normal/emoji-coin.svg',
        size: 24,
      },
    ],
  });

  useEffect(() => {
    if (fire) {
      runAnimation();
    }
  }, [fire]);

  // useEffect(() => {
  //   if (fire) doConfetti(emojis);
  // }, [fire]);
};

export { useConfetti };
