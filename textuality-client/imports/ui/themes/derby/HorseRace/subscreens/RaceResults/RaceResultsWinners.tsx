import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import React from 'react';
import RaceBets from '/imports/api/themes/derby/raceBets';
import { RaceBetWithHelpers } from '/imports/api/themes/derby/raceBets/raceBets';
import DerbyPlayerCircle from './DerbyPlayerCircle';
import commaNumber from 'comma-number';
import useTimedQueueMulti from '/imports/ui/hooks/use-timed-queue-multi';
import Players from '/imports/api/players/players';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  COLOR_DERBY_BEIGE,
  COLOR_DERBY_OFF_WHITE,
} from '../../../DerbyStyleVars';
import { FONT_FAMILY_EUROSTILE } from '../../../DerbyStyleVars';
import { capitalizeFirstLetter } from '/imports/utils/capitalize-first-letter';
import { condenseRaceBets } from '/imports/api/themes/derby/raceBets/helpers';

interface RaceResultsWinnersProps {
  raceId: string;
}

const DERBY_WINNERS_INTERVAL_SECONDS = 6;
const DERBY_WINNERS_NUM_TO_SHOW = 3;

const RaceResultsWinners: React.FC<RaceResultsWinnersProps> = ({ raceId }) => {
  useSubscribe('players.basic');
  useSubscribe('derby.raceBets.winnersForRace', raceId);

  const winningBets = useFind(
    () =>
      RaceBets.find({ race: raceId, status: 'won' }, { sort: { payout: -1 } }),
    [raceId],
  ) as RaceBetWithHelpers[];
  const players = useFind(() => Players.find({}));

  // Condense the winningBets down so that if a player has multiple,
  // winning bets of the same type, we show one that has their combined
  // payout.
  const condensedWinningBets = condenseRaceBets(winningBets);

  const currentWinners = useTimedQueueMulti(
    condensedWinningBets,
    DERBY_WINNERS_INTERVAL_SECONDS * 1000,
    DERBY_WINNERS_NUM_TO_SHOW,
  );

  console.log(condensedWinningBets);

  useGSAP(() => {
    // Create a timeline for the animation sequence
    const tl = gsap.timeline();

    // Initial state - invisible and slightly above
    gsap.set('.race-winner', {
      opacity: 0,
      y: -50,
      scale: 0.8,
      rotateY: -720,
    });

    // Staggered entrance (0.5s + 0.2s * (NUM_TO_SHOW - 1))
    tl.to('.race-winner', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      rotateY: 0,
    });

    // Bounce sequence (0.6s total)
    tl.to('.race-winner', {
      y: -10,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power1.inOut',
    }).to('.race-winner', {
      y: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'bounce.out',
    });

    tl.fromTo(
      '.race-winner-img',
      { rotation: -5 },
      {
        rotation: 5,
        duration: 0.78,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      },
    );

    // Hold for remaining time (TIME_INTERVAL_SECONDS - 1.1s - 0.6s - 0.5s)
    const holdDuration = DERBY_WINNERS_INTERVAL_SECONDS - 1.1 - 0.6 - 0.5;
    tl.to({}, { duration: holdDuration });

    // Staggered exit (0.5s + 0.2s * (NUM_TO_SHOW - 1))
    tl.to('.race-winner', {
      opacity: 0,
      y: 50,
      scale: 0.8,
      duration: 0.5,
      stagger: 0.2,
      ease: 'power2.in',
    });
  }, [currentWinners]);

  if (!currentWinners) return null;

  return (
    <div
      className="race-results-winners"
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10vw',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingBottom: '.8vh',
        background:
          'url(/derby/images/churchdowns.png) var(--derby-burgundy) no-repeat center center',
        backgroundSize: 'cover',
      }}
    >
      {currentWinners.map((bet) => {
        const player = players.find((p) => p._id === bet.player);
        if (!player) return null;
        if (!bet.type || !bet.payout) return null;
        return (
          <div
            key={bet._id}
            className="race-winner"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5vw',
              textShadow: '0 0 min(2vw, 1vh) rgba(0, 0, 0, 0.5)',
            }}
          >
            <DerbyPlayerCircle
              className="race-winner-img"
              player={player}
              zoom={0.8}
              width={250}
              height={250}
            />
            <div
              className="race-winner-alias"
              style={{
                fontFamily: FONT_FAMILY_EUROSTILE,
                fontSize: '2.6vw',
                color: COLOR_DERBY_OFF_WHITE,
              }}
            >
              {player.alias}
            </div>
            <div
              className="race-winner-amount"
              style={{
                fontFamily: FONT_FAMILY_EUROSTILE,
                fontSize: '3.5vw',
                color: COLOR_DERBY_OFF_WHITE,
              }}
            >
              +{commaNumber(bet.payout)} DD
            </div>
            <div
              className="race-winner-type"
              style={{
                fontFamily: FONT_FAMILY_EUROSTILE,
                fontSize: '3vw',
                color: COLOR_DERBY_OFF_WHITE,
              }}
            >
              {capitalizeFirstLetter(bet.type.toUpperCase())}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RaceResultsWinners;
