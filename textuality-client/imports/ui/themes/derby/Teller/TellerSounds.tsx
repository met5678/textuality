import React, { useRef, useEffect } from 'react';

import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { TellerStatus } from '/imports/schemas/derby/teller-status/teller-status';
import { Howl } from 'howler';

const SOUND_PATH = '/derby/sounds';

const STATUS_TO_SOUND: Partial<Record<TellerStatus, string>> = {
  open: `${SOUND_PATH}/teller-open-1.mp3`,
  'betting-impatient': `${SOUND_PATH}/teller-impatient-1.mp3`,
  timeout: `${SOUND_PATH}/teller-buzzer.mp3`,
  'giving-stub-single': `${SOUND_PATH}/teller-printstubs.mp3`,
  'giving-stub-multi': `${SOUND_PATH}/teller-printstubs.mp3`,
};

const STEP_SOUND = `${SOUND_PATH}/teller-ding.mp3`;

export const TellerSounds = ({
  teller,
  raceBet,
}: {
  teller: TellerWithHelpers;
  raceBet: RaceBetWithHelpers;
}) => {
  const { status } = teller;
  const sound = STATUS_TO_SOUND[status];

  const soundRef = useRef<Howl>();

  useEffect(() => {
    if (sound) {
      soundRef.current = new Howl({ src: [sound] });
      soundRef.current.play();
    }
  }, [sound]);

  useEffect(() => {
    if (raceBet?.status === 'pending') {
      soundRef.current = new Howl({ src: [STEP_SOUND] });
      soundRef.current.play();
    }
  }, [raceBet?.status, raceBet?.step]);

  return <></>;
};
