import React, { useEffect, useRef } from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { capitalizeFirstLetter } from '/imports/utils/capitalize-first-letter';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
const BRIOSO_FONT_FAMILY = 'brioso-pro-display, serif';
const EUROSTILE_FONT_FAMILY = 'eurostile, sans-serif';
const COLORS = {
  DERBY_BURGUNDY: '#681E22',
  DERBY_BEIGE: '#C4B090',
  DERBY_BLACK: '#16171B',
  DERBY_OFF_WHITE: '#FEFAE7',
  DERBY_ORANGE: '#945226',
};

export const RaceIntroText = ({
  race,
  active,
}: {
  race: RaceWithHelpers;
  active: boolean;
}) => {
  const numberRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const conditionsRef = useRef<HTMLDivElement>(null);
  const furlongsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (active) {
      gsap
        .timeline()
        .set(
          [
            numberRef.current,
            nameRef.current,
            conditionsRef.current,
            furlongsRef.current,
          ],
          {
            opacity: 0,
            scale: 1,
          },
        )
        .to(numberRef.current, {
          opacity: 1,
          scale: 1.25,
          duration: 1,
          ease: 'power1.inOut',
        })
        .to(
          nameRef.current,
          {
            opacity: 1,
            scale: 1.25,
            duration: 1,
            ease: 'power1.inOut',
          },
          '+=0.25',
        )
        .to(
          conditionsRef.current,
          {
            opacity: 1,
            scale: 1.25,
            duration: 1,
            ease: 'power1.inOut',
          },
          '+=0.25',
        )
        .to(
          furlongsRef.current,
          {
            opacity: 1,
            scale: 1.25,
            duration: 1,
            ease: 'power1.inOut',
          },
          '+=0.25',
        );
    } else {
      gsap.set(
        [
          numberRef.current,
          nameRef.current,
          conditionsRef.current,
          furlongsRef.current,
        ],
        {
          opacity: 0,
          scale: 1,
        },
      );
    }
  }, [active]);

  return (
    <div
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2vh',
        paddingBottom: '10vh',
      }}
    >
      <div
        ref={numberRef}
        style={{
          fontFamily: EUROSTILE_FONT_FAMILY,
          fontSize: '8vh',
          color: COLORS.DERBY_BURGUNDY,
          paddingBottom: '2vh',
        }}
      >
        Race{' '}
        <span style={{ color: COLORS.DERBY_BURGUNDY }}>#{race.number}</span>
      </div>
      {race.name && (
        <div
          ref={nameRef}
          style={{
            fontFamily: BRIOSO_FONT_FAMILY,
            fontSize: '20vh',
            textShadow: '2px 4px 6px #000',
          }}
        >
          {race.name}
        </div>
      )}
      <div
        ref={conditionsRef}
        style={{
          fontFamily: EUROSTILE_FONT_FAMILY,
          fontSize: '8vh',
          color: COLORS.DERBY_BURGUNDY,
        }}
      >
        Conditions: {capitalizeFirstLetter(race.weather)}
      </div>
      <div
        ref={furlongsRef}
        style={{
          fontFamily: EUROSTILE_FONT_FAMILY,
          fontSize: '8vh',
          color: COLORS.DERBY_BURGUNDY,
        }}
      >
        Furlongs: {race.furlong_length}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '5vh',
          left: '6vw',
          height: '26vh',
          width: 'auto',
        }}
      >
        <img
          style={{
            height: '100%',
            width: 'auto',
            rotate: '-15deg',
            opacity: 0.95,
          }}
          src="/derby/images/logo.png"
        />
      </div>
    </div>
  );
};
