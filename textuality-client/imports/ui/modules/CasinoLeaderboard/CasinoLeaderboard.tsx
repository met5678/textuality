import React from 'react';
import './CasinoLeaderboard.css';

import RouletteChip from '../Roulette/RouletteChip';
import Players from '/imports/api/players';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { themes, Theme } from '../../themes/casino/CasinoThemeConfig';
import FlashyText from '../../themes/casino/FlashyText/FlashyText';
import commaNumber from 'comma-number';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CasinoLeaderboard = ({ skin }: { skin: string }) => {
  const isLoading = useSubscribe('players.basic');
  const theme = themes[skin as Theme];
  const currency = theme.currency;

  const players = useFind(
    () => Players.find({}, { sort: { money: -1 }, limit: 12 }),
    [],
  );

  useGSAP(() => {
    const circles = gsap.utils.toArray('.leaderboard-img');
    gsap.fromTo(
      circles,
      { rotation: -10 },
      {
        rotation: 10,
        duration: 0.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      },
    );
    gsap.timeline({ repeat: -1, repeatDelay: 15 }).fromTo(
      circles,
      {
        rotateY: 360,
        transformPerspective: 1000,
      },
      {
        rotateY: 0,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        duration: 0.8,
      },
    );
  }, [players]);

  return (
    <div className={`leaderboard-casino ${skin}`}>
      <div className="leaderboard-title">
        <FlashyText text="High Rollers" />
      </div>

      <div className="leaderboard-body">
        {players.map((player) => (
          <div
            key={player._id}
            className="leaderboard-row"
            style={{ color: 'white' }}
          >
            <div className="leaderboard-img">
              <RouletteChip avatar_id={player.avatar!} zoom={1} />
            </div>
            <p className="leaderboard-item">{player.alias} </p>
            <p className="leaderboard-value">
              {commaNumber(player.money)} {currency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CasinoLeaderboard;
