import React, { useState, useEffect } from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { RaceIntroText } from './RaceIntroText';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RaceIntroJockeys } from './RaceIntroJockeys';
import { RaceIntroDerbygoers } from './RaceIntroDerbygoers';

type ComponentType = 'text' | 'jockeys' | 'derbygoers';

export const RaceIntroSubscreen = ({ race }: { race: RaceWithHelpers }) => {
  const [currentComponent, setCurrentComponent] =
    useState<ComponentType>('text');
  const textRef = React.useRef<HTMLDivElement>(null);
  const jockeysRef = React.useRef<HTMLDivElement>(null);
  const derbygoersRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const timeline = gsap.timeline({ repeat: 0 });

    // Initial setup
    timeline
      .set([jockeysRef.current, derbygoersRef.current], {
        opacity: 0,
        onComplete: () => {
          setCurrentComponent('text');
        },
      })
      .set(textRef.current, {
        opacity: 0,
        onComplete: () => {
          setCurrentComponent('text');
        },
      })
      .to(textRef.current, {
        opacity: 1,
        duration: 0.5,
        onStart: () => {
          setCurrentComponent('text');
        },
      })
      .to(
        textRef.current,
        {
          opacity: 0,
          duration: 0.5,
          onStart: () => {
            setCurrentComponent('text');
          },
        },
        '+=7',
      )
      .to(jockeysRef.current, {
        opacity: 1,
        duration: 0.5,
        onStart: () => {
          setCurrentComponent('jockeys');
        },
      })
      .to(
        jockeysRef.current,
        {
          opacity: 0,
          duration: 0.5,
          onStart: () => {
            setCurrentComponent('jockeys');
          },
        },
        '+=9',
      )
      .to(derbygoersRef.current, {
        opacity: 1,
        duration: 0.5,
        onStart: () => {
          setCurrentComponent('derbygoers');
        },
      })
      .to(
        derbygoersRef.current,
        {
          opacity: 0,
          duration: 0.5,
          onStart: () => {
            setCurrentComponent('derbygoers');
          },
        },
        '+=9',
      );
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        ref={textRef}
      >
        <RaceIntroText race={race} active={currentComponent === 'text'} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        ref={jockeysRef}
      >
        <RaceIntroJockeys race={race} active={currentComponent === 'jockeys'} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        ref={derbygoersRef}
      >
        <RaceIntroDerbygoers
          race={race}
          active={currentComponent === 'derbygoers'}
        />
      </div>
      <audio src="/derby/sounds/gavotte-intro-30s.mp3" autoPlay />
    </>
  );
};
