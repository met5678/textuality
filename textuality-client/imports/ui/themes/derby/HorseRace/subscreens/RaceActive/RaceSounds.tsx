import React, { useEffect, useRef } from 'react';
import { RaceController } from './RacePixi/RaceController';
import { RaceWithHelpers } from '/imports/api/themes/derby/race/races';
import { useTracker } from 'meteor/react-meteor-data';
import { racesGetCurrentSync } from '/imports/api/themes/derby/race/methods/races.getCurrent';
const CHEERING_SOUND = '/derby/sounds/cheering.mp3';
const FINISH_SOUND = '/derby/sounds/finish-fanfare.mp3';
const GALLOPING_SOUND = '/derby/sounds/galloping.mp3';
const STARTING_BELL = '/derby/sounds/starting-bell.mp3';

export const RaceSounds = ({
  race,
  raceController,
}: {
  race: RaceWithHelpers;
  raceController: RaceController;
}) => {
  const howlCheer = useRef<Howl>();
  const howlFinish = useRef<Howl>();
  const howlGallop = useRef<Howl>();
  const howlStart = useRef<Howl>();
  const isPlaying = useTracker(
    () =>
      racesGetCurrentSync({ 'timeline.is_playing': 1 })?.timeline.is_playing,
  );

  useEffect(() => {
    howlCheer.current = new Howl({
      src: CHEERING_SOUND,
      volume: 0.75,
    });
    howlFinish.current = new Howl({
      src: FINISH_SOUND,
    });
    howlGallop.current = new Howl({
      src: GALLOPING_SOUND,
      loop: true,
    });
    howlStart.current = new Howl({
      src: STARTING_BELL,
    });
  }, []);

  useEffect(() => {
    const onFinish = () => {
      howlFinish.current?.play();
      howlCheer.current?.play();
    };

    raceController.registerOnFinishCallback(onFinish);

    return () => {
      raceController.unregisterOnFinishCallback(onFinish);
      howlFinish.current?.stop();
      howlCheer.current?.stop();
      howlFinish.current?.unload();
      howlCheer.current?.unload();
    };
  }, []);

  useEffect(() => {
    const onStart = () => {
      howlStart.current?.play();
    };

    raceController.registerOnStartCallback(onStart);

    return () => {
      raceController.unregisterOnStartCallback(onStart);
      howlStart.current?.stop();
      howlStart.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      howlGallop.current?.play();
    } else {
      howlGallop.current?.stop();
    }

    return () => {
      howlGallop.current?.stop();
    };
  }, [isPlaying]);

  return null;
};
