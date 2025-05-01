import React from 'react';
import gsap from 'gsap';

import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { useEffect, useRef } from 'react';

type TellerPlayerProps = {
  player?: PlayerWithHelpers;
  raceBet?: RaceBetWithHelpers;
};

export const TellerPlayer = ({ player, raceBet }: TellerPlayerProps) => {
  console.log({ player, raceBet });

  if (!player || !raceBet) {
    return null;
  }

  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playerRef.current) {
      gsap.to(playerRef.current, {
        y: -20,
        duration: 0.15,
        yoyo: true,
        repeat: 5,
        ease: 'power1.inOut',
      });
    }
  }, [raceBet.step]);

  useEffect(() => {
    if (playerRef.current && raceBet.status == 'cancelled-timeout') {
      if (raceBet.status === 'cancelled-timeout') {
        gsap.to(playerRef.current, {
          rotation: 360,
          opacity: 0,
          duration: 2,
          ease: 'power1.inOut',
        });
      } else {
        gsap.to(playerRef.current, {
          rotation: 0,
          opacity: 1,
          duration: 0,
          ease: 'power1.inOut',
        });
      }
    }
  }, [raceBet.status]);

  return (
    <div
      style={{ position: 'absolute', bottom: '20px', width: '80%' }}
      ref={playerRef}
    >
      <img
        src={player.getAvatarUrl(100)}
        style={{ width: '100%', borderRadius: '20px' }}
      />
    </div>
  );
};
