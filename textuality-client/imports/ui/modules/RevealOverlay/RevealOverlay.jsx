import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import Countdown from 'react-countdown-now';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import Rounds from 'api/rounds';

import RevealIntro from './phases/Intro';
import Room from './phases/Room';
import Suspect from './phases/Suspect';
import Weapon from './phases/Weapon';
import Finale from './phases/Finale';

const PhaseComponents = {
  intro: RevealIntro,
  room: Room,
  person: Suspect,
  weapon: Weapon,
  finale: Finale,
};

const RevealOverlay = ({ event, mission }) => {
  const roundLoading = useSubscribe('rounds.current');
  const cluesLoading = useSubscribe('clues.basic');
  const playersLoading = useSubscribe('players.basic');
  const round = useTracker(() => Rounds.current());

  if (roundLoading() || cluesLoading() || playersLoading() || !round)
    return null;
  if (!round || round.status !== 'reveal' || !round.revealState) return null;

  const { revealState, solution } = round;

  console.log({ revealState });

  const { phase } = revealState;

  const classNames = classnames({
    active: true,
    revealOverlay: true,
    [revealState.phase]: true,
  });

  const phaseParts = phase.split('-');
  const phasePrefix = phaseParts[0];

  const PhaseComponent = PhaseComponents[phasePrefix] ?? null;

  return (
    <div className={classNames}>
      {PhaseComponent && (
        <PhaseComponent revealState={revealState} solution={solution} />
      )}
    </div>
  );
};

export default RevealOverlay;
