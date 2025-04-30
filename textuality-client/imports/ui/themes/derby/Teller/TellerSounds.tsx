import React, { useRef, useEffect } from 'react';

import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import { TellerWithHelpers } from '/imports/api/themes/derby/tellers/tellers';
import { TellerStatus } from '/imports/schemas/derby/teller-status/teller-status';
import { Howl } from 'howler';

const SOUND_PATH = '/derby/sounds';

const STATUS_TO_SOUND: Partial<Record<TellerStatus, string>> = {
  open: `${SOUND_PATH}/teller-open.mp3`,
  'betting-impatient': `${SOUND_PATH}/teller-impatient.mp3`,
};

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

  return <></>;
};
