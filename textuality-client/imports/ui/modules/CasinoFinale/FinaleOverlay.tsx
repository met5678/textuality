import React, { useRef } from 'react';
import { Event } from '/imports/schemas/event';
import './FinaleOverlay.css';
import RouletteChip from '../Roulette/RouletteChip';
import FlashyText from '../../themes/casino/FlashyText/FlashyText';
import { themes, Theme } from '../../themes/casino/CasinoThemeConfig';
import commaNumber from 'comma-number';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const FinaleOverlay = ({ event }: { event: Event }) => {
  const { finale_data, skin } = event;
  const { phase } = finale_data;

  console.log(finale_data);

  const theme = themes[skin as Theme];
  const currency = theme.currency;
  const phaseRef = useRef(null);

  useGSAP(
    () => {
      if (!phaseRef.current) return;
      const child = phaseRef.current.querySelector('.fadein');
      if (!child) return;
      gsap.fromTo(
        child,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power1.out' },
      );
    },
    { dependencies: [phase] },
  );

  const phaseTitle = (title: string) => {
    return (
      <h2>
        <FlashyText text={title} />
      </h2>
    );
  };

  const phasePlayerChip = (datum: string) => {
    return (
      <>
        <RouletteChip
          width={250}
          height={250}
          avatar_id={finale_data.player.avatar}
        />
        <div className="finale-player-name">{finale_data.player.alias}</div>
        <div className="finale-player-datum">{datum}</div>
      </>
    );
  };

  const isSpace = event.skin === 'space';

  const renderPhase = () => {
    switch (phase) {
      case 'pre':
        return (
          <>
            <div className="glitch-fullscreen" />
            <audio src="/casino/sounds/glitch.ogg" autoPlay />
          </>
        );

      case 'hacker-appears':
        return (
          <div className="video-fullscreen">
            <video src="/casino/videos/emptyvault.mp4" autoPlay muted />
          </div>
        );

      case 'total-money':
        return (
          <div className="finale-text fadein">
            {phaseTitle('Total VC Won')}
            <div className="finale-money-stolen">
              {commaNumber(finale_data.totalMoney)} {currency}
            </div>
          </div>
        );

      case 'most-money':
        return (
          <div className={isSpace ? 'finale-split fadein' : 'fadein'}>
            <div className="finale-player">
              {phaseTitle('Biggest Winner')}
              {phasePlayerChip(
                `${commaNumber(finale_data.player.money)} ${currency}`,
              )}
            </div>
            {isSpace && (
              <video
                src="/casino/space/videos/shady-finale-1.mp4"
                autoPlay
                muted
              />
            )}
          </div>
        );

      case 'most-checkpoints':
        return (
          <div
            className={
              isSpace ? 'finale-split finale-split-video-left fadein' : 'fadein'
            }
          >
            <div className="finale-player">
              {phaseTitle('Hashtag Finder')}
              {phasePlayerChip(
                `${finale_data.player.checkpoints} hashtags found!`,
              )}
            </div>
            {isSpace && (
              <video
                src="/casino/space/videos/liz-finale-2.mp4"
                autoPlay
                muted
              />
            )}
          </div>
        );

      case 'most-slot-spins':
        return (
          <div className={isSpace ? 'finale-split fadein' : 'fadein'}>
            <div className="finale-player">
              {phaseTitle('Slot Spinner')}
              {phasePlayerChip(`${finale_data.player.slot_spins} spins!`)}
            </div>
            {isSpace && (
              <video
                src="/casino/space/videos/shady-finale-2.mp4"
                autoPlay
                muted
              />
            )}
          </div>
        );

      case 'most-popular-slot':
        return (
          <div
            className={
              isSpace ? 'finale-split finale-split-video-left fadein' : 'fadein'
            }
          >
            <div className="finale-player">
              {phaseTitle('Most Popular Slot')}
              <RouletteChip
                width={250}
                height={250}
                imgUrl={`\/images/slot-machine/${event.skin}/${finale_data.slotMachine.short}.jpg`}
              />
              <div className="finale-player-name">
                {finale_data.slotMachine.name}
              </div>
              <div className="finale-player-datum">
                {finale_data.slotMachine.spins} spins!
              </div>
            </div>
            {isSpace && <video src="/casino/videos/liz.mp4" autoPlay muted />}
          </div>
        );

      case 'end':
        return (
          <div className="fadein">
            <div className="finale-text">
              Now put down the phones and enjoy the rest of your night!
            </div>
          </div>
        );
    }
  };

  return (
    <div ref={phaseRef} className={`finale-overlay ${phase} ${skin}`}>
      {finale_data?.playBG == true && (
        <div className="video-fullscreen">
          <video src="/casino/videos/pokerbg.mp4" autoPlay muted />
        </div>
      )}
      <div className="finale-phase">{renderPhase()}</div>
    </div>
  );
};
export default FinaleOverlay;
