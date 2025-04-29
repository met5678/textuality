import React, { useCallback, useEffect, useRef } from 'react';
import '../Teller.css';

import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { TellerActor } from '/imports/schemas/derby/teller';
import gsap from 'gsap';
import { TellerStatus } from '/imports/schemas/derby/teller-status/teller-status';

type TellerVideoProps = {
  teller: TellerWithHelpers;
};

const END_BUFFER_SECS = 1;
const TRANSITION_COLOR = 'rgba(200, 200, 200, 1)';

const VIDEO_SUFFIXES: Record<TellerStatus, string> = {
  opening: 'open',
  open: 'idle',
  betting: 'engaged',
  'betting-impatient': 'impatient',
  timeout: 'timeout',
  'giving-stub-single': 'stubs-one',
  'giving-stub-multi': 'stubs-multi',
  closing: 'close',
  break: 'break',
  standup: 'standup',
  empty: 'sitdown',
  sitdown: 'sitdown',
};

const VIDEOS_LOOPABLE: TellerStatus[] = [
  'open',
  'betting',
  'betting-impatient',
  'break',
];

const VIDEOS_PLAYBACKRATE_CHANGEABLE: TellerStatus[] = ['open', 'break'];

const VIDEOS_WITH_SOUND: TellerStatus[] = ['opening', 'closing'];
const VIDEO_FREEZE: TellerStatus[] = ['empty'];

const VIDEO_PATH = '/derby/videos/teller';

const getVideoUrl = (actor: TellerActor, status: TellerStatus) => {
  const suffix = VIDEO_SUFFIXES[status];
  return `${VIDEO_PATH}/${actor}-teller-${suffix}.mp4`;
};

export const TellerVideo = ({ teller }: TellerVideoProps) => {
  const { actor, status } = teller;
  const videoRef = useRef<HTMLVideoElement>(null);
  const transitionDiv = useRef<HTMLDivElement>(null);
  const videoLoaded = useCallback(() => {
    if (!videoRef.current) {
      return;
    }
    if (VIDEOS_LOOPABLE.includes(status)) {
      const startTime = Math.max(
        0,
        Math.random() * (videoRef.current.duration - END_BUFFER_SECS),
      );
      videoRef.current.currentTime = startTime;
      videoRef.current.loop = true;
    } else {
      videoRef.current.currentTime = 0;
      videoRef.current.loop = false;
    }

    if (VIDEOS_PLAYBACKRATE_CHANGEABLE.includes(status)) {
      videoRef.current.playbackRate = Math.random() * 0.4 + 0.8;
    } else {
      videoRef.current.playbackRate = 1;
    }

    if (VIDEOS_WITH_SOUND.includes(status)) {
      videoRef.current.muted = false;
    } else {
      videoRef.current.muted = true;
    }

    if (VIDEO_FREEZE.includes(status)) {
      videoRef.current.pause();
    } else {
      try {
        videoRef.current.play();
      } catch (e) {
        console.warn("Video with audio won't play without interaction");
      }
    }

    if (transitionDiv.current) {
      transitionDiv.current.style.opacity = '1';
      gsap.to(transitionDiv.current, {
        delay: 0.1,
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [status]);

  // Hook up video loaded event
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.addEventListener('loadedmetadata', videoLoaded);

    return () => {
      videoRef.current?.removeEventListener('loadedmetadata', videoLoaded);
    };
  }, [videoRef, videoLoaded]);

  // Switch the video source when the status changes
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.src = getVideoUrl(actor, status);
    videoRef.current.autoplay = true;
  }, [actor, status]);

  return (
    <div className="teller-video">
      <video ref={videoRef} />
      <div
        className="teller-video-transition"
        ref={transitionDiv}
        style={{
          backgroundColor: TRANSITION_COLOR,
        }}
      ></div>
    </div>
  );
};
