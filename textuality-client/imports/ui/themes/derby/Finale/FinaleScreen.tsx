import React from 'react';
import { Event } from '/imports/schemas/event';
import commaNumber from 'comma-number';
import { FONT_FAMILY_BRIOSO, FONT_FAMILY_EUROSTILE } from '../DerbyStyleVars';
import { useSubscribe } from 'meteor/react-meteor-data';
import Players, { PlayerWithHelpers } from '/imports/api/players/players';
import DerbyPlayerCircle from '../HorseRace/subscreens/RaceResults/DerbyPlayerCircle';
import { useFind } from 'meteor/react-meteor-data';
import FinaleOverlay from '/imports/ui/modules/CasinoFinale/FinaleOverlay';
import { capitalizeFirstLetter } from '/imports/utils/capitalize-first-letter';
import { COLOR_DERBY_OFF_WHITE } from '../DerbyStyleVars';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FinalePlayerBet } from './FinalePlayerBet';
import Horses, {
  HorseWithHelpers,
} from '/imports/api/themes/derby/horses/horses';

const FINALE_PHASES = [
  'finale-intro',
  'biggest-wallets',
  'biggest-bet-winners',
  'biggest-bet-losers',
  'most-hashtags',
  'most-fortunes',
  'horses',
] as const;
type FinalePhase = (typeof FINALE_PHASES)[number];

type FINALE_TREATMENTS = 'title' | 'players' | 'horses';

// JTG
//const DERBY_FINALE_SLIDE_DURATION_SECONDS = 1100;
const DERBY_FINALE_SLIDE_DURATION_SECONDS = 11;
const DERBY_FINALE_NUM_TO_SHOW = 3;

const FINALE_TREATMENT_TEXT: Record<FinalePhase, FINALE_TREATMENTS> = {
  'finale-intro': 'title',
  'biggest-wallets': 'players',
  'biggest-bet-winners': 'players',
  'biggest-bet-losers': 'players',
  'most-hashtags': 'players',
  'most-fortunes': 'players',
  horses: 'horses',
};

const FINALE_PHASE_TITLES: Record<FinalePhase, string> = {
  'finale-intro': 'Grand Finale',
  'biggest-wallets': 'Biggest Wallets',
  'biggest-bet-winners': 'Biggest Bet Winners',
  'biggest-bet-losers': 'Biggest Bet Losers',
  'most-hashtags': 'Most Hashtags',
  'most-fortunes': 'Most Fortunes',
  horses: 'Now show off those hats!',
};

const FinaleTitleSlide = ({
  finale_data,
}: {
  finale_data: Event['finale_data'];
}) => {
  const { phase } = finale_data;
  const logoRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!logoRef.current) return;

    gsap.fromTo(
      logoRef.current,
      { rotation: -10 },
      {
        rotation: 10,
        duration: 0.78,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      },
    );
  }, []);

  return (
    <div
      className="derby-finale-title-slide"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '10vh',
      }}
    >
      <div
        className="derby-finale-title-slide-title"
        style={{
          fontFamily: FONT_FAMILY_BRIOSO,
          fontSize: '20vh',
          color: COLOR_DERBY_OFF_WHITE,
          textShadow: `1px 2px 1px rgba(0, 0, 0, 0.5)`,
          marginBottom: '10',
        }}
      >
        {FINALE_PHASE_TITLES[phase]}
        {phase === 'finale-intro' && (
          <div
            ref={logoRef}
            style={{
              position: 'absolute',
              bottom: '5vh',
              left: '5vw',
              width: '16vw',
            }}
          >
            <img
              style={{
                width: '100%',
                height: 'auto',
                rotate: '-12deg',
                opacity: 0.85,
              }}
              src="/derby/images/logo.png"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const FinalePlayersSlide = ({
  finale_data,
  players,
  horses,
}: {
  finale_data: Event['finale_data'];
  players: PlayerWithHelpers[];
  horses: HorseWithHelpers[];
}) => {
  const winners = finale_data.players as Record<string, string | number>[];
  const phase = finale_data.phase as FinalePhase;

  console.log('winners', winners);

  useGSAP(() => {
    // Create a timeline for the animation sequence
    const tl = gsap.timeline();

    // First, ensure all previous winners are invisible
    gsap.set('.race-winner', {
      opacity: 0,
      y: -50,
      scale: 0.8,
      rotateY: -720,
      clearProps: 'all',
    });

    // Then set up the new winners
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

    // Continuous rotation animation
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
    const holdDuration = DERBY_FINALE_SLIDE_DURATION_SECONDS - 1.1 - 0.6 - 0.5;
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

    return () => {
      tl.kill();
      // Ensure all winners are invisible when cleaning up
      gsap.set('.race-winner', {
        opacity: 0,
        y: -50,
        scale: 0.8,
        rotateY: -720,
        clearProps: 'all',
      });
    };
  }, [winners]);

  return (
    <div
      className="derby-finale-players-slide"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '4vh',
      }}
    >
      <div
        className="derby-finale-players-slide-title"
        style={{
          fontFamily: FONT_FAMILY_BRIOSO,
          fontSize: '8vw',
          color: COLOR_DERBY_OFF_WHITE,
          textShadow: `1px 2px 1px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {FINALE_PHASE_TITLES[phase]}
      </div>
      <div
        className="derby-finale-players-slide-players"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10vw',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '2vh',
          textAlign: 'center',
        }}
      >
        {winners.map((winner, index) => {
          const player = players.find((p) => p._id === winner.player);
          if (!player) return null;
          return (
            <div
              key={`${phase}-${winner.player}-${index}`}
              className="race-winner"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
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
                  paddingTop: '1vh',
                }}
              >
                {player.alias}
              </div>

              {phase === 'biggest-wallets' && (
                <div
                  className="race-winner-amount"
                  style={{
                    fontFamily: FONT_FAMILY_EUROSTILE,
                    fontSize: '3.5vw',
                    color: COLOR_DERBY_OFF_WHITE,
                  }}
                >
                  {commaNumber(winner.money)} DD
                </div>
              )}

              {phase === 'biggest-bet-winners' && (
                <FinalePlayerBet
                  wager={winner.wager}
                  payout={winner.payout}
                  type={winner.type}
                  allHorses={horses}
                  betHorseIds={winner.horses}
                />
              )}

              {phase === 'biggest-bet-losers' && (
                <FinalePlayerBet
                  wager={winner.wager}
                  type={winner.type}
                  allHorses={horses}
                  betHorseIds={winner.horses}
                />
              )}

              {phase === 'most-hashtags' && (
                <div
                  className="race-winner-amount"
                  style={{
                    fontFamily: FONT_FAMILY_EUROSTILE,
                    fontSize: '3.5vw',
                    color: COLOR_DERBY_OFF_WHITE,
                  }}
                >
                  {winner.hashtags} Hashtags!
                </div>
              )}

              {phase === 'most-fortunes' && (
                <div
                  className="race-winner-amount"
                  style={{
                    fontFamily: FONT_FAMILY_EUROSTILE,
                    fontSize: '3.5vw',
                    color: COLOR_DERBY_OFF_WHITE,
                  }}
                >
                  {winner.fortunes} Fortunes!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FinaleHorsesSlide = ({
  finale_data,
}: {
  finale_data: Event['finale_data'];
}) => {
  useGSAP(() => {
    const timeline = gsap.timeline();

    timeline
      .to('.derby-finale-title', {
        opacity: 1,
        duration: 0.5,
      })
      .to(
        '.derby-finale-title',
        {
          scale: 1.2,
          duration: 11,
          ease: 'power1.inOut',
        },
        0,
      )
      .to(
        '.derby-finale-title',
        {
          opacity: 0,
          duration: 0.5,
        },
        10.5,
      );
  });

  return (
    <div
      className="derby-finale-title-horses"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '10vh',
      }}
    >
      <div
        className="derby-finale-title-horses-title"
        style={{
          fontFamily: FONT_FAMILY_BRIOSO,
          fontSize: '3.5vw',
          color: COLOR_DERBY_OFF_WHITE,
        }}
      >
        Now show off those hats!
      </div>
      <img src="/derby/images/finale-horses.png" style={{ width: '90vw' }} />
    </div>
  );
};

export const FinaleScreen = ({ event }: { event: Event }) => {
  useSubscribe('players.basic');
  useSubscribe('derby.horses.all');
  const players = useFind(() => Players.find({}));
  const horses = useFind(() => Horses.find({}));

  const { finale_data } = event;
  const phase = finale_data.phase as FinalePhase;

  return (
    <div
      className="derby-finale-screen"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background:
          'url(/derby/images/churchdowns.png) var(--derby-burgundy) no-repeat center center',
        backgroundSize: 'cover',
      }}
    >
      {FINALE_TREATMENT_TEXT[phase] === 'title' && (
        <FinaleTitleSlide finale_data={finale_data} />
      )}
      {FINALE_TREATMENT_TEXT[phase] === 'players' && (
        <FinalePlayersSlide
          finale_data={finale_data}
          players={players}
          horses={horses}
        />
      )}
      {FINALE_TREATMENT_TEXT[phase] === 'horses' && (
        <FinaleHorsesSlide finale_data={finale_data} />
      )}
    </div>
  );
};
