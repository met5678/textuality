import React from 'react';
import gsap, { clamp } from 'gsap';

import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import { PlayerWithHelpers } from '/imports/api/players/players';
import { useEffect, useRef } from 'react';

type TellerPlayerProps = {
  player?: PlayerWithHelpers;
  raceBet?: RaceBetWithHelpers;
  gettingFortune?: boolean;
};

export const TellerPlayer = ({
  player,
  raceBet,
  gettingFortune,
}: TellerPlayerProps) => {
  console.log({ player, raceBet, gettingFortune });

  if (!player || (!gettingFortune && !raceBet)) {
    return null;
  }

  const playerRef = useRef<HTMLDivElement>(null);
  const playerImg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playerImg.current) {
      gsap.to(playerImg.current, {
        y: -20,
        duration: 0.15,
        yoyo: true,
        repeat: 5,
        ease: 'power1.inOut',
      });
    }
  }, [raceBet?.step]);

  useEffect(() => {
    if (
      playerRef.current &&
      playerImg.current &&
      raceBet?.status == 'cancelled-timeout'
    ) {
      if (raceBet.status === 'cancelled-timeout') {
        gsap.to(playerImg.current, {
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
  }, [raceBet?.status]);

  return (
    <div
      style={{ position: 'absolute', bottom: '2vh', textAlign: 'center' }}
      ref={playerRef}
    >
      <div ref={playerImg}>
        <img
          src={player.getAvatarUrl(100)}
          style={{
            borderRadius: '50%',
            width: 'clamp(30vw, min(50vw, 20vh), 60vw)',
            height: 'clamp(30vw, min(50vw, 20vh), 60vw)',
            border: 'min(2vw, 0.4vh) solid var(--derby-off-white)',
            marginBottom: 'min(-3vw, -2vh)',
            filter: 'drop-shadow(0 0 min(2vw, 1vh) rgba(0, 0, 0, 0.5))',
          }}
        />
      </div>
      <div
        style={{
          // fontSize: 'clamp(20px, 7vmin, 24px)',
          fontFamily: 'eurostile',
          fontSize: 'min(12vw, 3vh)',
          fontWeight: 'bold',
          color: 'var(--derby-off-white)',
          textShadow: '0 0 min(2vw, 1vh) rgba(0, 0, 0, 0.5)',
          marginTop: 'min(4vw, 4vh)',
          display: 'block',
          // color: 'var(--derby-burgundy)',
          // textAlign: 'center',
          // backgroundColor: 'var(--derby-off-white)',
          // padding: 'max(2vw, 1vh) max(2vw, 2vh)',
          // borderRadius: 'max(6vw, 4vh)',
          // filter: 'drop-shadow(0 0 min(2vw, 1vh) rgba(0, 0, 0, 0.5))',
        }}
      >
        {player.alias}
      </div>
    </div>
  );
};
