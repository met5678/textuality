import React, { useMemo, useState, useEffect, useRef } from 'react';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { useTracker } from 'meteor/react-meteor-data';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import Horses from '/imports/api/themes/derby/horses';
import {
  racesGetCurrent,
  racesGetCurrentSync,
} from '/imports/api/themes/derby/race/methods/races.getCurrent';

export const JOCKEYCAM_AREA_HEIGHT = 200;
export const JOCKEYCAM_AREA_WIDTH = (JOCKEYCAM_AREA_HEIGHT * 16) / 9;

const JOCKEY_CAM_VIDEO_TEMPLATE = '/derby/videos/jockey/jockey#-goofy.mp4';
const AUDIENCE_CAM_VIDEOS = [
  '/derby/videos/group/group-watching-1.mp4',
  '/derby/videos/group/group-watching-2.mp4',
  '/derby/videos/group/group-watching-3.mp4',
];

const JockeyCam = ({
  src,
  onTimeUpdate,
}: {
  src: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && onTimeUpdate) {
      const video = videoRef.current;
      const handleTimeUpdate = () => {
        onTimeUpdate(video.currentTime, video.duration);
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [onTimeUpdate]);

  return (
    <div
      id="horse-race-jockey-camera"
      style={{
        backgroundColor: 'var(--derby-orange)',
        borderLeft: '3px solid #222',
        borderRight: '3px solid #222',
        width: '30%',
        maxHeight: JOCKEYCAM_AREA_HEIGHT,
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'sepia(0.5)',
        }}
        src={src}
        autoPlay
        muted
        loop
      />
    </div>
  );
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const JockeyCams = ({ race }: { race: RaceWithHelpers }) => {
  useSubscribe('horses.all');
  const horses = useFind(() =>
    Horses.find({ _id: { $in: race.horses } }, { sort: { number: 1 } }),
  );
  const isPlaying = useTracker(
    () => racesGetCurrentSync()?.timeline.is_playing,
  );

  const jockeyVideos = useMemo(() => {
    return horses.map((horse) => {
      return {
        src: JOCKEY_CAM_VIDEO_TEMPLATE.replace('#', horse.number.toString()),
        number: horse.number,
      };
    });
  }, [horses]);

  const audienceVideos = useMemo(() => {
    return AUDIENCE_CAM_VIDEOS.map((video) => {
      return {
        src: video,
      };
    });
  }, []);

  const [currentVideos, setCurrentVideos] = useState<{ src: string }[]>([]);
  const videoDurations = useRef<{ [key: string]: number }>({});
  const videoQueues = useRef<{ [key: string]: { src: string }[] }>({});

  // Initialize or update video queues when videos change
  useEffect(() => {
    const availableVideos = isPlaying ? jockeyVideos : audienceVideos;
    const queueKey = isPlaying ? 'jockey' : 'audience';

    // Create a new queue if it doesn't exist or if the video set has changed
    if (
      !videoQueues.current[queueKey] ||
      videoQueues.current[queueKey].length !== availableVideos.length
    ) {
      videoQueues.current[queueKey] = shuffleArray(availableVideos);
    }
  }, [isPlaying, jockeyVideos, audienceVideos]);

  const getNextVideo = (index: number): { src: string } => {
    const queueKey = isPlaying ? 'jockey' : 'audience';
    const queue = videoQueues.current[queueKey];

    if (!queue || queue.length === 0) {
      // Fallback if queue is empty
      const availableVideos = isPlaying ? jockeyVideos : audienceVideos;
      return availableVideos[
        Math.floor(Math.random() * availableVideos.length)
      ];
    }

    // Get the next video from the queue
    const nextVideo = queue[0];

    // Move the used video to the end of the queue
    videoQueues.current[queueKey] = [...queue.slice(1), nextVideo];

    return nextVideo;
  };

  const switchVideo = (index: number) => {
    const newVideo = getNextVideo(index);
    setCurrentVideos((prev) => {
      const newVideos = [...prev];
      newVideos[index] = newVideo;
      return newVideos;
    });
  };

  useEffect(() => {
    // Initialize with first videos from queue
    const initialVideos = Array(3)
      .fill(null)
      .map((_, index) => getNextVideo(index));
    setCurrentVideos(initialVideos);
  }, [isPlaying, jockeyVideos, audienceVideos]);

  const handleTimeUpdate = (
    index: number,
    currentTime: number,
    duration: number,
  ) => {
    if (!videoDurations.current[currentVideos[index]?.src]) {
      videoDurations.current[currentVideos[index]?.src] = duration;
    }

    // Switch video when it's 80% through
    if (currentTime > duration * 0.8) {
      switchVideo(index);
    }
  };

  return (
    <div
      id="horse-race-jockey-cameras"
      style={{
        width: '100%',
        maxHeight: JOCKEYCAM_AREA_HEIGHT,
        height: '30vh',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'stretch',
        backgroundColor: 'var(--derby-burgundy)',
        backgroundImage: 'url(/derby/textures/wood.png)',
        backgroundRepeat: 'repeat',
        borderTop: '3px solid #222',
      }}
    >
      {currentVideos.map((video, index) => (
        <JockeyCam
          key={index}
          src={video.src}
          onTimeUpdate={(currentTime, duration) =>
            handleTimeUpdate(index, currentTime, duration)
          }
        />
      ))}
    </div>
  );
};
