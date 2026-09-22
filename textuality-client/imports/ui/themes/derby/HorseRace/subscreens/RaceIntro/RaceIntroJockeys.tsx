import React, { useEffect, useRef } from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Horses from '/imports/api/themes/derby/horses/horses';

const EUROSTILE_FONT_FAMILY = 'eurostile, sans-serif';
const COLORS = {
  DERBY_BURGUNDY: '#681E22',
  DERBY_BEIGE: '#C4B090',
  DERBY_BLACK: '#16171B',
  DERBY_OFF_WHITE: '#FEFAE7',
  DERBY_ORANGE: '#945226',
};

const JOCKEY_PATH_TEMPLATE = '/derby/videos/jockey/jockey#-square.mp4';

export const RaceIntroJockeys = ({
  race,
  active,
}: {
  race: RaceWithHelpers;
  active: boolean;
}) => {
  useSubscribe('derby.horses.all');
  const horses = useFind(() =>
    Horses.find({ _id: { $in: race.horses } }, { sort: { number: 1 } }),
  );
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    if (active) {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.currentTime = 0;
          video.play();
        }
      });
    } else {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
        }
      });
    }
  }, [active]);

  useGSAP(() => {
    // Animation setup will be handled by parent component
  });

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
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3vw',
          maxWidth: '90%',
        }}
      >
        {horses.map((horse, index) => (
          <div
            key={horse._id}
            className="horse-intro-jockey"
            style={{
              width: '20vw',
              height: '20vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1vh',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el!)}
                src={JOCKEY_PATH_TEMPLATE.replace('#', '' + horse.number)}
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                }}
              />
            </div>
            <div
              className="horse-intro-jockey-name"
              style={{
                fontFamily: EUROSTILE_FONT_FAMILY,
                fontSize: '4vh',
                color: COLORS.DERBY_BURGUNDY,
                textAlign: 'center',
              }}
            >
              {horse.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
